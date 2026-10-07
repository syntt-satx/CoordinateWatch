from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import json
import random
from datetime import datetime, timedelta
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from analytics.preprocessing import load_and_preprocess_data
from analytics.engine import CoordinationEngine
from analytics.pdf_generator import generate_pdf_report
from sklearn.feature_extraction.text import CountVectorizer

app = FastAPI(
    title="CoordinateWatch AI Backend",
    description="Explainable Coordinated-Review Intelligence Platform REST API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ANALYZED_DATA = None
PRODUCT_STATS = None

def initialize_data():
    global ANALYZED_DATA, PRODUCT_STATS
    try:
        data_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'amazon_reviews_synthetic.csv')
        df = load_and_preprocess_data(data_path)
        engine = CoordinationEngine(df)
        ANALYZED_DATA = engine.run_full_analysis()
        
        # Aggregate product statistics
        grouped = ANALYZED_DATA.groupby(['product_id', 'product_name', 'platform']).agg(
            review_count=('review_id', 'count'),
            avg_rating=('rating', 'mean'),
            avg_risk_score=('coordination_risk_score', 'mean'),
            high_risk_count=('risk_level', lambda x: (x == 'HIGH').sum())
        ).reset_index()
        
        grouped['overall_risk_level'] = grouped['avg_risk_score'].apply(
            lambda x: 'HIGH' if x > 70 else ('MEDIUM' if x > 30 else 'LOW')
        )
        PRODUCT_STATS = grouped
        print("Data initialization complete. Products:", PRODUCT_STATS['product_id'].tolist())
    except Exception as e:
        print(f"Failed to initialize data: {e}")

@app.on_event("startup")
def startup_event():
    initialize_data()

@app.get("/")
def read_root():
    return {
        "service": "CoordinateWatch AI Backend",
        "tagline": "Don't judge the review. Investigate the pattern.",
        "version": "1.0.0",
        "status": "online"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "dataLoaded": ANALYZED_DATA is not None,
        "totalReviews": len(ANALYZED_DATA) if ANALYZED_DATA is not None else 0
    }

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    if ANALYZED_DATA is None or PRODUCT_STATS is None:
        raise HTTPException(status_code=503, detail="Data not ready")
        
    total_reviews = len(ANALYZED_DATA)
    total_products = len(PRODUCT_STATS)
    high_risk_cases = int(PRODUCT_STATS[PRODUCT_STATS['overall_risk_level'] == 'HIGH'].shape[0])
    avg_risk = float(ANALYZED_DATA['coordination_risk_score'].mean())
    active_signals = int((ANALYZED_DATA['coordination_risk_score'] > 50).sum())
    
    return {
        "reviewsAnalysed": total_reviews,
        "productsObserved": total_products,
        "highRiskCases": high_risk_cases,
        "activeSignals": active_signals,
        "suspiciousClusters": 4,
        "averageCoordinationRisk": round(avg_risk, 1)
    }

@app.get("/api/products")
def get_products():
    if PRODUCT_STATS is None:
        raise HTTPException(status_code=503, detail="Data not ready")
    return PRODUCT_STATS.to_dict(orient="records")

@app.get("/api/cases/{product_id}")
def get_case_details(product_id: str):
    if ANALYZED_DATA is None or PRODUCT_STATS is None:
        raise HTTPException(status_code=503, detail="Data not ready")
        
    product_reviews = ANALYZED_DATA[ANALYZED_DATA['product_id'] == product_id].copy()
    if len(product_reviews) == 0:
        raise HTTPException(status_code=404, detail="Product not found")
        
    stat_row = PRODUCT_STATS[PRODUCT_STATS['product_id'] == product_id].iloc[0]
    
    # Rating distribution
    rating_counts = {str(r): int((product_reviews['rating'] == r).sum()) for r in range(1, 6)}
    
    # Timeline aggregation (group by day)
    product_reviews['day_str'] = product_reviews['timestamp'].dt.strftime('%Y-%m-%d')
    daily_timeline = product_reviews.groupby('day_str').size().reset_index(name='count').to_dict(orient='records')
    
    # Reviewer stats
    unique_reviewers = product_reviews['reviewer_id'].nunique()
    reviews_per_user = round(len(product_reviews) / max(unique_reviewers, 1), 2)
    
    # Multi-signal scores
    signals = {
        "textSimilarity": round(float(product_reviews['signal_text_similarity'].mean()), 2),
        "temporalConcentration": round(float(product_reviews['signal_temporal_burst'].mean()), 2),
        "ratingSynchronization": round(float(product_reviews['signal_rating_concentration'].mean()), 2),
        "reviewerBehaviour": round(float(product_reviews['signal_reviewer_behavior'].mean()), 2)
    }

    # Extract common n-gram clusters
    common_phrases = []
    try:
        vec = CountVectorizer(ngram_range=(3, 7), stop_words='english', min_df=2)
        X = vec.fit_transform(product_reviews['review_text_norm'])
        freqs = zip(vec.get_feature_names_out(), X.sum(axis=0).tolist()[0])
        sorted_phrases = sorted(freqs, key=lambda x: -x[1])
        common_phrases = [p[0] for p in sorted_phrases if p[1] > 2][:5]
    except:
        pass

    # Top flagged reviews for evidence
    suspicious = product_reviews.sort_values('coordination_risk_score', ascending=False).head(8).copy()
    suspicious['timestamp'] = suspicious['timestamp'].dt.strftime('%Y-%m-%d %H:%M')
    
    # Network Graph Data (Reviewer -> Review -> Product)
    nodes = [{"id": product_id, "label": stat_row['product_name'], "type": "product", "risk": stat_row['overall_risk_level']}]
    links = []
    
    # Sample nodes for graph visualization
    sample_graph_reviews = suspicious.head(6)
    for _, rev in sample_graph_reviews.iterrows():
        rev_node_id = f"rev_{rev['review_id']}"
        usr_node_id = f"usr_{rev['reviewer_id']}"
        
        # User node
        if not any(n['id'] == usr_node_id for n in nodes):
            nodes.append({"id": usr_node_id, "label": rev['reviewer_id'], "type": "reviewer"})
            
        # Review node
        nodes.append({
            "id": rev_node_id,
            "label": f"{rev['rating']}★ ({rev['coordination_risk_score']})",
            "type": "review",
            "text": rev['review_text_original'][:60] + "...",
            "score": rev['coordination_risk_score']
        })
        
        links.append({"source": usr_node_id, "target": rev_node_id})
        links.append({"source": rev_node_id, "target": product_id})

    # Case descriptions & platforms
    case_descriptions = {
        'AMZ-EARBUDS-PRO-X': "High textual similarity burst targeting wireless earbuds on Amazon. Involves cloned praise across a short 36-hour window.",
        'YT-VIDEO-CRYPTO-SCAN': "Automated bot spam campaign on YouTube driving viewers to an off-platform recovery scam handle.",
        'MYN-DENIM-JACKET-99': "Coordinated 5-star rating boost campaign on Myntra fashion catalog with syndicated review text.",
        'GP-FINTECH-APP-SEC': "Polarized 1-star review bomb targeting a digital wallet app with identical smear text on Google Play.",
        'ORG-COFFEE-MAKER-05': "Organic control baseline exhibiting natural linguistic entropy, diverse ratings, and standard purchase distribution."
    }

    return {
        "productId": product_id,
        "productName": stat_row['product_name'],
        "platform": stat_row['platform'],
        "description": case_descriptions.get(product_id, "Monitored case file target."),
        "reviewCount": int(stat_row['review_count']),
        "averageRating": round(float(stat_row['avg_rating']), 2),
        "overallRiskScore": int(stat_row['avg_risk_score']),
        "riskClassification": str(stat_row['overall_risk_level']),
        "ratingDistribution": rating_counts,
        "timeline": daily_timeline,
        "uniqueReviewers": unique_reviewers,
        "reviewsPerUser": reviews_per_user,
        "signals": signals,
        "commonPhrases": common_phrases,
        "topReviews": suspicious.to_dict(orient="records"),
        "networkGraph": {"nodes": nodes, "links": links}
    }

@app.get("/api/network")
def get_global_network():
    """Returns global cluster network graph of top suspicious connections"""
    if ANALYZED_DATA is None:
        raise HTTPException(status_code=503, detail="Data not ready")
        
    top_high_risk = ANALYZED_DATA[ANALYZED_DATA['coordination_risk_score'] > 60].head(25)
    
    nodes = []
    links = []
    added_ids = set()
    
    for _, row in top_high_risk.iterrows():
        prod_id = row['product_id']
        rev_id = f"rev_{row['review_id']}"
        usr_id = f"usr_{row['reviewer_id']}"
        
        if prod_id not in added_ids:
            nodes.append({"id": prod_id, "label": prod_id, "type": "product", "color": "#E94B4B"})
            added_ids.add(prod_id)
            
        if usr_id not in added_ids:
            nodes.append({"id": usr_id, "label": row['reviewer_id'], "type": "reviewer", "color": "#FFE59A"})
            added_ids.add(usr_id)
            
        nodes.append({"id": rev_id, "label": f"{row['rating']}★", "type": "review", "color": "#FFB86B", "text": row['review_text_original']})
        links.append({"source": usr_id, "target": rev_id})
        links.append({"source": rev_id, "target": prod_id})
        
    return {"nodes": nodes, "links": links}

class ScanRequest(BaseModel):
    reviews: list[str]

@app.post("/api/scan")
def scan_reviews(request: ScanRequest):
    if len(request.reviews) < 2:
        raise HTTPException(status_code=400, detail="Please provide at least 2 reviews for comparative analysis.")
        
    data = []
    base_time = datetime.now()
    
    for i, txt in enumerate(request.reviews):
        data.append({
            'review_id': f'SCAN_{i}',
            'product_id': 'SCAN_PRODUCT',
            'reviewer_id': f'SCAN_USER_{i % max(len(request.reviews)//2, 1)}',
            'rating': 5,
            'review_text': txt,
            'timestamp': base_time - timedelta(minutes=i*15),
            'verified_purchase': True
        })
        
    df_raw = pd.DataFrame(data)
    temp_path = f"temp_scan_{random.randint(1000, 9999)}.csv"
    df_raw.to_csv(temp_path, index=False)
    
    try:
        df = load_and_preprocess_data(temp_path)
        engine = CoordinationEngine(df)
        analyzed = engine.run_full_analysis()
        
        # Highlight extraction
        common_phrases = []
        try:
            vec = CountVectorizer(ngram_range=(3, 7), stop_words='english', min_df=2)
            X = vec.fit_transform(analyzed['review_text_norm'])
            freqs = zip(vec.get_feature_names_out(), X.sum(axis=0).tolist()[0])
            sorted_phrases = sorted(freqs, key=lambda x: -x[1])
            common_phrases = [p[0] for p in sorted_phrases if p[1] > 1][:5]
        except:
            pass
            
        avg_risk = float(analyzed['coordination_risk_score'].mean())
        risk_level = 'HIGH' if avg_risk > 70 else ('MEDIUM' if avg_risk > 30 else 'LOW')
        results = analyzed[['review_text_original', 'coordination_risk_score', 'signal_text_similarity']].to_dict(orient="records")
        
        return {
            "overallRiskScore": int(avg_risk),
            "riskClassification": risk_level,
            "commonPhrases": common_phrases,
            "reviews": results
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/scan/upload-csv")
async def scan_csv(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        temp_path = f"temp_upload_{random.randint(1000, 9999)}.csv"
        with open(temp_path, "wb") as f:
            f.write(contents)
            
        df = load_and_preprocess_data(temp_path)
        engine = CoordinationEngine(df)
        analyzed = engine.run_full_analysis()
        
        common_phrases = []
        try:
            vec = CountVectorizer(ngram_range=(3, 7), stop_words='english', min_df=2)
            X = vec.fit_transform(analyzed['review_text_norm'])
            freqs = zip(vec.get_feature_names_out(), X.sum(axis=0).tolist()[0])
            sorted_phrases = sorted(freqs, key=lambda x: -x[1])
            common_phrases = [p[0] for p in sorted_phrases if p[1] > 1][:5]
        except:
            pass
            
        avg_risk = float(analyzed['coordination_risk_score'].mean())
        risk_level = 'HIGH' if avg_risk > 70 else ('MEDIUM' if avg_risk > 30 else 'LOW')
        results = analyzed[['review_text_original', 'coordination_risk_score', 'signal_text_similarity']].to_dict(orient="records")
        
        return {
            "overallRiskScore": int(avg_risk),
            "riskClassification": risk_level,
            "commonPhrases": common_phrases,
            "reviews": results[:50] # Top 50 sample
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

class SimulationRequest(BaseModel):
    scenario: str
    reviewCount: int
    intensity: str

@app.post("/api/lab")
def simulate_attack(request: SimulationRequest):
    data = []
    base_time = datetime.now()
    
    # Baseline organic traffic
    for i in range(40):
        data.append({
            'review_id': f'SIM_ORG_{i:03d}',
            'product_id': 'SIMULATION_TARGET',
            'reviewer_id': f'USER_{random.randint(1000, 9999)}',
            'rating': random.choice([2, 3, 4, 5]),
            'review_text': random.choice([
                "Good product for everyday use.",
                "Quality is fine, delivery was on time.",
                "Slightly smaller than expected, but works.",
                "Satisfied with this purchase overall."
            ]),
            'timestamp': base_time - timedelta(days=random.randint(1, 15)),
            'verified_purchase': True
        })
        
    attack_count = request.reviewCount
    time_window_hours = 48 if request.intensity == "Low" else (12 if request.intensity == "Medium" else 2)
    
    if request.scenario in ["Rating Boost", "Promotional Campaign", "Product Launch"]:
        phrases = [
            "Incredible quality! Truly the best investment ever made, 100% recommend to everyone.",
            "Truly the best investment ever made! Incredible quality, 100% recommend to everyone.",
            "100% recommend to everyone! Incredible quality and fastest delivery.",
            "Simply unbeatable quality, truly the best investment ever made!"
        ]
        for i in range(attack_count):
            data.append({
                'review_id': f'SIM_ATT_{i:03d}',
                'product_id': 'SIMULATION_TARGET',
                'reviewer_id': f'ATT_USER_{i % 12}',
                'rating': 5,
                'review_text': random.choice(phrases),
                'timestamp': base_time - timedelta(minutes=random.randint(0, time_window_hours * 60)),
                'verified_purchase': False
            })
    else: # Coordinated Negative Campaign
        phrases = [
            "Defective and dangerous! Stole my money and support blocked me. Absolute scam.",
            "Absolute scam! Defective and dangerous, support blocked my number!",
            "Do not buy! Defective and dangerous, seller refused to issue refund.",
            "Complete rip-off, dangerous defective item and support blocked me."
        ]
        for i in range(attack_count):
            data.append({
                'review_id': f'SIM_ATT_{i:03d}',
                'product_id': 'SIMULATION_TARGET',
                'reviewer_id': f'ATT_USER_{i % 12}',
                'rating': 1,
                'review_text': random.choice(phrases),
                'timestamp': base_time - timedelta(minutes=random.randint(0, time_window_hours * 60)),
                'verified_purchase': False
            })
            
    df_raw = pd.DataFrame(data)
    temp_path = f"temp_sim_{random.randint(1000, 9999)}.csv"
    df_raw.to_csv(temp_path, index=False)
    
    try:
        df = load_and_preprocess_data(temp_path)
        engine = CoordinationEngine(df)
        analyzed = engine.run_full_analysis()
        
        avg_risk = float(analyzed['coordination_risk_score'].mean())
        results = analyzed.sort_values('coordination_risk_score', ascending=False).head(25).to_dict(orient="records")
        for r in results:
            r['timestamp'] = str(r['timestamp'])
            
        return {
            "overallRiskScore": int(avg_risk),
            "riskClassification": "HIGH" if avg_risk > 70 else ("MEDIUM" if avg_risk > 30 else "LOW"),
            "simulatedReviews": results
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/api/reports/export-pdf")
def export_pdf():
    if ANALYZED_DATA is None or PRODUCT_STATS is None:
        raise HTTPException(status_code=503, detail="Analytics data not initialized")
    
    stats = {
        "reviewsAnalysed": len(ANALYZED_DATA),
        "productsObserved": len(PRODUCT_STATS),
        "highRiskCases": int(PRODUCT_STATS[PRODUCT_STATS['overall_risk_level'] == 'HIGH'].shape[0]),
        "averageCoordinationRisk": round(float(ANALYZED_DATA['coordination_risk_score'].mean()), 1)
    }
    
    products = PRODUCT_STATS.to_dict(orient="records")
    pdf_buffer = generate_pdf_report(stats, products)
    
    filename = f"coordinatewatch_intelligence_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
