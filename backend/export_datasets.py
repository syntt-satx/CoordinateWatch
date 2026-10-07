import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(data_dir, exist_ok=True)

# 1. Load the existing master synthetic dataset if present or recreate
master_path = os.path.join(data_dir, 'amazon_reviews_synthetic.csv')
if os.path.exists(master_path):
    df_master = pd.read_csv(master_path)
else:
    from generate_data import generate_synthetic_reviews
    generate_synthetic_reviews()
    df_master = pd.read_csv(master_path)

# Drop NaN or corrupted rows for clean Excel viewing
df_clean = df_master.dropna(subset=['review_text']).copy()
df_clean['review_text'] = df_clean['review_text'].astype(str).str.strip()
df_clean = df_clean[df_clean['review_text'].str.len() > 3].drop_duplicates(subset=['review_id'])

# Save Clean Master Dataset for Excel
master_excel_path = os.path.join(data_dir, 'curated_all_cases_master.csv')
df_clean.to_csv(master_excel_path, index=False, encoding='utf-8-sig')
print(f"Exported Master Dataset: {master_excel_path} ({len(df_clean)} rows)")

# Export Individual Curated Case CSVs
cases_map = {
    'AMZ-EARBUDS-PRO-X': '01_amazon_wireless_earbuds_case.csv',
    'YT-VIDEO-CRYPTO-SCAN': '02_youtube_comment_campaign_case.csv',
    'MYN-DENIM-JACKET-99': '03_myntra_fashion_review_case.csv',
    'GP-FINTECH-APP-SEC': '04_google_play_app_reviews_case.csv',
    'ORG-COFFEE-MAKER-05': '05_organic_control_case.csv'
}

for prod_id, filename in cases_map.items():
    case_df = df_clean[df_clean['product_id'] == prod_id].copy()
    if len(case_df) > 0:
        file_path = os.path.join(data_dir, filename)
        case_df.to_csv(file_path, index=False, encoding='utf-8-sig')
        print(f"Exported Case {prod_id} -> {filename} ({len(case_df)} rows)")

# ==============================================================================
# EXTRA DATASET 1: LIVE SIMULATION ALPHA (Fast-Flood 5★ Astroturfing Ring)
# Target: PROD-TITAN-SMARTWATCH-9
# Scenario: 100 Coordinated reviews flooded within 4 hours, plus 30 organic reviews
# ==============================================================================
base_time_alpha = datetime(2024, 10, 1, 14, 0, 0)
data_sim_alpha = []

# Coordinated clone cluster
alpha_clones = [
    "Unbelievable battery life, lasted 7 full days on one charge! Best smartwatch by far.",
    "Best smartwatch by far, unbelievable battery life and super fast display! 100% recommend.",
    "Unbelievable battery life, lasted 7 full days on one charge! Extremely premium build.",
    "Super fast display and unbelievable battery life, best smartwatch by far! Absolutely love it."
]

for i in range(100):
    data_sim_alpha.append({
        'review_id': f'SIM_A_ATT_{i+1:04d}',
        'product_id': 'PROD-TITAN-SMARTWATCH-9',
        'product_name': 'Titan Ultra AMOLED Smartwatch Series 9',
        'platform': 'Amazon',
        'reviewer_id': f'ALPHA_SYBIL_{(i % 15) + 1001}', # 15 bot accounts rotating
        'rating': 5,
        'review_text': random.choice(alpha_clones),
        'timestamp': base_time_alpha + timedelta(minutes=random.randint(0, 240)), # 4-hour flood
        'verified_purchase': False
    })

# Organic background reviews
alpha_organic_texts = [
    "Heart rate monitor seems accurate, but companion app disconnects occasionally.",
    "Decent watch for the price point, strap could be softer.",
    "Screen brightness is good outdoors in sunlight.",
    "Step counter works well. Notifications are slightly delayed sometimes.",
    "Average build quality, looks fine for casual wear."
]

for i in range(30):
    data_sim_alpha.append({
        'review_id': f'SIM_A_ORG_{i+1:04d}',
        'product_id': 'PROD-TITAN-SMARTWATCH-9',
        'product_name': 'Titan Ultra AMOLED Smartwatch Series 9',
        'platform': 'Amazon',
        'reviewer_id': f'GENUINE_CUST_{random.randint(5000, 9999)}',
        'rating': random.choices([2, 3, 4], weights=[0.25, 0.45, 0.30])[0],
        'review_text': random.choice(alpha_organic_texts),
        'timestamp': base_time_alpha - timedelta(days=random.randint(1, 14)),
        'verified_purchase': True
    })

df_sim_alpha = pd.DataFrame(data_sim_alpha).sample(frac=1, random_state=42).reset_index(drop=True)
sim_alpha_path = os.path.join(data_dir, 'extra_live_simulation_alpha_boost_attack.csv')
df_sim_alpha.to_csv(sim_alpha_path, index=False, encoding='utf-8-sig')
print(f"Exported Extra Simulation 1: {sim_alpha_path} ({len(df_sim_alpha)} rows)")

# ==============================================================================
# EXTRA DATASET 2: LIVE SIMULATION BETA (Coordinated 1★ Competitor Smear Campaign)
# Target: APP-NEXA-FINTECH-WALLET
# Scenario: 110 Synchronized 1-star defamatory reviews across a 6-hour window
# ==============================================================================
base_time_beta = datetime(2024, 10, 3, 9, 30, 0)
data_sim_beta = []

beta_smear_clones = [
    "Total fraud company! Frozen all my funds without explanation and support blocked my email!",
    "Support blocked my email and frozen all my funds! Do not trust this total fraud company!",
    "Beware! Frozen all my funds without explanation, total fraud company, support blocked me!",
    "Do not trust this total fraud company, frozen all my funds and support blocked my number!"
]

for i in range(110):
    data_sim_beta.append({
        'review_id': f'SIM_B_ATT_{i+1:04d}',
        'product_id': 'APP-NEXA-FINTECH-WALLET',
        'product_name': 'NexaPay Mobile Wallet & Remittance',
        'platform': 'Google Play',
        'reviewer_id': f'BETA_BOT_{(i % 20) + 2001}', # 20 burner accounts
        'rating': 1,
        'review_text': random.choice(beta_smear_clones),
        'timestamp': base_time_beta + timedelta(minutes=random.randint(0, 360)), # 6-hour smear wave
        'verified_purchase': False
    })

beta_organic_texts = [
    "Clean interface, quick international money transfers.",
    "Customer service was helpful when setting up two-factor authentication.",
    "Transaction fees are reasonable compared to traditional banks.",
    "App crashes rarely after latest update, overall very satisfied.",
    "Good daily banking app, fingerprint login is very quick."
]

for i in range(35):
    data_sim_beta.append({
        'review_id': f'SIM_B_ORG_{i+1:04d}',
        'product_id': 'APP-NEXA-FINTECH-WALLET',
        'product_name': 'NexaPay Mobile Wallet & Remittance',
        'platform': 'Google Play',
        'reviewer_id': f'REGULAR_USER_{random.randint(5000, 9999)}',
        'rating': random.choices([4, 5], weights=[0.35, 0.65])[0],
        'review_text': random.choice(beta_organic_texts),
        'timestamp': base_time_beta - timedelta(days=random.randint(1, 10)),
        'verified_purchase': True
    })

df_sim_beta = pd.DataFrame(data_sim_beta).sample(frac=1, random_state=42).reset_index(drop=True)
sim_beta_path = os.path.join(data_dir, 'extra_live_simulation_beta_smear_campaign.csv')
df_sim_beta.to_csv(sim_beta_path, index=False, encoding='utf-8-sig')
print(f"Exported Extra Simulation 2: {sim_beta_path} ({len(df_sim_beta)} rows)")
