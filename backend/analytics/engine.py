import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import timedelta

class CoordinationEngine:
    def __init__(self, data: pd.DataFrame):
        self.df = data.copy()
        
    def run_full_analysis(self):
        """Runs the complete coordination detection pipeline"""
        self._feature_engineering()
        self._text_similarity_analysis()
        self._temporal_analysis()
        self._reviewer_behaviour_analysis()
        self._rating_analysis()
        self._calculate_risk_scores()
        
        return self.df

    def _feature_engineering(self):
        self.df['review_length'] = self.df['review_text_original'].str.len()
        self.df['word_count'] = self.df['review_text_original'].apply(lambda x: len(str(x).split()))
        
        # Initialize signal columns
        self.df['signal_text_similarity'] = 0.0
        self.df['signal_temporal_burst'] = 0.0
        self.df['signal_reviewer_behavior'] = 0.0
        self.df['signal_rating_concentration'] = 0.0

    def _text_similarity_analysis(self, threshold=0.85):
        """Calculates TF-IDF cosine similarity per product to find coordinated text"""
        for product_id in self.df['product_id'].unique():
            mask = self.df['product_id'] == product_id
            product_reviews = self.df[mask].copy()
            
            if len(product_reviews) < 2:
                continue
                
            vectorizer = TfidfVectorizer(stop_words='english', max_features=1000)
            try:
                tfidf_matrix = vectorizer.fit_transform(product_reviews['review_text_norm'])
                sim_matrix = cosine_similarity(tfidf_matrix)
                
                # For each review, count how many other reviews it is highly similar to
                # Subtract 1 because a review is always perfectly similar to itself
                high_sim_counts = (sim_matrix > threshold).sum(axis=1) - 1
                
                # Normalize similarity score to 0-1
                # If a review is similar to >10% of product reviews or >10 reviews, flag it highly
                max_expected_sim = min(len(product_reviews) * 0.2, 20) 
                sim_scores = np.clip(high_sim_counts / max_expected_sim, 0, 1)
                
                self.df.loc[mask, 'signal_text_similarity'] = sim_scores
            except Exception as e:
                # Fallback if TF-IDF fails (e.g. empty corpus)
                pass

    def _temporal_analysis(self, window_hours=48):
        """Detects unnatural spikes in review volume"""
        for product_id in self.df['product_id'].unique():
            mask = self.df['product_id'] == product_id
            product_reviews = self.df[mask].sort_values('timestamp')
            
            # Count reviews in rolling window
            rolling_counts = product_reviews.set_index('timestamp').rolling(f'{window_hours}h').count()['review_id']
            
            # Calculate baseline (mean reviews per window)
            baseline = rolling_counts.mean()
            std_dev = rolling_counts.std() if pd.notna(rolling_counts.std()) else 1
            
            # Score based on how many standard deviations above baseline
            z_scores = (rolling_counts - baseline) / (std_dev + 0.1)
            burst_scores = np.clip(z_scores / 3, 0, 1) # Cap at 3 std devs
            
            # Map scores back to original dataframe
            burst_scores.index = product_reviews.index
            self.df.loc[mask, 'signal_temporal_burst'] = burst_scores

    def _reviewer_behaviour_analysis(self):
        """Analyzes reviewer behavior patterns"""
        reviewer_stats = self.df.groupby('reviewer_id').agg(
            total_reviews=('review_id', 'count'),
            avg_rating=('rating', 'mean')
        )
        
        # Simple heuristic: users with many reviews all at extreme ratings are slightly more suspicious
        reviewer_stats['behavior_score'] = 0.0
        
        # High velocity
        reviewer_stats.loc[reviewer_stats['total_reviews'] > 5, 'behavior_score'] += 0.4
        
        # Extreme average rating
        extreme_rating = (reviewer_stats['avg_rating'] >= 4.8) | (reviewer_stats['avg_rating'] <= 1.2)
        reviewer_stats.loc[extreme_rating, 'behavior_score'] += 0.3
        
        reviewer_stats['behavior_score'] = np.clip(reviewer_stats['behavior_score'], 0, 1)
        
        # Merge back
        behavior_map = reviewer_stats['behavior_score'].to_dict()
        self.df['signal_reviewer_behavior'] = self.df['reviewer_id'].map(behavior_map)

    def _rating_analysis(self):
        """Detects unnatural concentrations of specific ratings"""
        for product_id in self.df['product_id'].unique():
            mask = self.df['product_id'] == product_id
            
            # If a product has >80% 5-star or >80% 1-star ratings, flag for rating concentration
            rating_counts = self.df[mask]['rating'].value_counts(normalize=True)
            max_concentration = rating_counts.max()
            
            # Score goes from 0 at 50% concentration to 1 at 90% concentration
            concentration_score = np.clip((max_concentration - 0.5) / 0.4, 0, 1)
            
            self.df.loc[mask, 'signal_rating_concentration'] = concentration_score

    def _calculate_risk_scores(self):
        """Weights individual signals to create a final Coordination Risk Score (0-100)"""
        # Weights (Configurable prototype thresholds)
        weights = {
            'signal_text_similarity': 0.35,
            'signal_temporal_burst': 0.30,
            'signal_rating_concentration': 0.20,
            'signal_reviewer_behavior': 0.15
        }
        
        # Calculate raw score (0.0 to 1.0)
        raw_score = (
            self.df['signal_text_similarity'] * weights['signal_text_similarity'] +
            self.df['signal_temporal_burst'] * weights['signal_temporal_burst'] +
            self.df['signal_rating_concentration'] * weights['signal_rating_concentration'] +
            self.df['signal_reviewer_behavior'] * weights['signal_reviewer_behavior']
        )
        
        # Convert to 0-100 scale
        self.df['coordination_risk_score'] = (raw_score * 100).round().astype(int)
        
        # Assign risk bands
        def assign_band(score):
            if score <= 30: return 'LOW'
            elif score <= 70: return 'MEDIUM'
            else: return 'HIGH'
            
        self.df['risk_level'] = self.df['coordination_risk_score'].apply(assign_band)
