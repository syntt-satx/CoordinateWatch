import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_synthetic_reviews():
    base_time = datetime(2024, 9, 1, 10, 0, 0)
    data = []

    # ==========================================
    # Case 1: Amazon Wireless Earbuds (High Similarity + Temporal Burst)
    # Target: AMZ-EARBUDS-PRO-X
    # Platform: Amazon
    # ==========================================
    burst_time_1 = base_time + timedelta(days=12, hours=14)
    cloned_phrases_1 = [
        "Absolutely amazing sound quality, best earbuds I have ever owned! Highly recommend to everyone.",
        "Absolutely amazing sound quality, best earbuds I have ever owned! Great battery life too.",
        "Sound quality is absolutely amazing, best earbuds I have ever owned! Super fast delivery.",
        "Best earbuds I have ever owned, absolutely amazing sound quality! Must buy."
    ]
    # 80 Coordinated reviews in a 36-hour burst
    for i in range(80):
        data.append({
            'review_id': f'REV_AMZ_{i:04d}',
            'product_id': 'AMZ-EARBUDS-PRO-X',
            'product_name': 'AeroSound Pro Wireless Earbuds',
            'platform': 'Amazon',
            'reviewer_id': f'AMZ_USER_{1000 + (i % 25)}', # Repeated reviewer IDs exhibiting velocity
            'rating': 5,
            'review_text': random.choice(cloned_phrases_1),
            'timestamp': burst_time_1 + timedelta(minutes=random.randint(0, 36 * 60)),
            'verified_purchase': True
        })
    # 40 Organic background reviews
    for i in range(40):
        data.append({
            'review_id': f'REV_AMZ_ORG_{i:04d}',
            'product_id': 'AMZ-EARBUDS-PRO-X',
            'product_name': 'AeroSound Pro Wireless Earbuds',
            'platform': 'Amazon',
            'reviewer_id': f'AMZ_CUST_{random.randint(5000, 9999)}',
            'rating': random.choices([2, 3, 4, 5], weights=[0.15, 0.25, 0.35, 0.25])[0],
            'review_text': random.choice([
                "Decent bass for the price, but case feels cheap.",
                "Comfortable fit during runs, battery lasts about 4 hours.",
                "Microphone is somewhat muffled during outdoor calls.",
                "Fair quality overall, nothing exceptional but gets the job done."
            ]),
            'timestamp': base_time + timedelta(days=random.randint(0, 30), hours=random.randint(0, 23)),
            'verified_purchase': random.choice([True, False])
        })

    # ==========================================
    # Case 2: YouTube Comment Campaign (Bot Spam / Promo Links)
    # Target: YT-VIDEO-CRYPTO-SCAN
    # Platform: YouTube
    # ==========================================
    burst_time_2 = base_time + timedelta(days=18, hours=8)
    bot_comments = [
        "Mr. Harrison helped me recover my lost assets in less than 24 hours! Contact him on telegram @cryptofix_official",
        "I was skeptical until Mr. Harrison recovered my assets in less than 24 hours! Contact telegram @cryptofix_official",
        "Big thanks to Mr. Harrison for recovering my crypto investment in 24 hours! Reach out @cryptofix_official",
        "Trustworthy recovery service by Mr. Harrison, helped me get my funds back within 24h via telegram @cryptofix_official"
    ]
    for i in range(65):
        data.append({
            'review_id': f'REV_YT_{i:04d}',
            'product_id': 'YT-VIDEO-CRYPTO-SCAN',
            'product_name': 'Web3 Security & Risk Deep Dive #42',
            'platform': 'YouTube',
            'reviewer_id': f'YT_BOT_{2000 + (i % 15)}',
            'rating': 5,
            'review_text': random.choice(bot_comments),
            'timestamp': burst_time_2 + timedelta(minutes=random.randint(0, 18 * 60)),
            'verified_purchase': False
        })
    for i in range(35):
        data.append({
            'review_id': f'REV_YT_ORG_{i:04d}',
            'product_id': 'YT-VIDEO-CRYPTO-SCAN',
            'product_name': 'Web3 Security & Risk Deep Dive #42',
            'platform': 'YouTube',
            'reviewer_id': f'YT_USER_{random.randint(5000, 9999)}',
            'rating': random.choices([3, 4, 5], weights=[0.2, 0.4, 0.4])[0],
            'review_text': random.choice([
                "Really insightful video on smart contract vulnerabilities.",
                "Audio levels are a bit low in the second half.",
                "Could you cover flash loan attacks next week?",
                "Great production quality, subscribed!"
            ]),
            'timestamp': base_time + timedelta(days=random.randint(0, 30)),
            'verified_purchase': False
        })

    # ==========================================
    # Case 3: Myntra Fashion Review (Incentivized Rating Boost)
    # Target: MYN-DENIM-JACKET-99
    # Platform: Myntra
    # ==========================================
    burst_time_3 = base_time + timedelta(days=5, hours=19)
    fashion_boost_phrases = [
        "Superb fabric quality, perfect fitting and looks very stylish! Worth every single penny.",
        "Perfect fitting and looks very stylish, superb fabric quality! Highly recommended brand.",
        "Worth every single penny! Superb fabric quality, perfect fitting and arrived on time.",
        "Very stylish look with superb fabric quality, fits true to size!"
    ]
    for i in range(70):
        data.append({
            'review_id': f'REV_MYN_{i:04d}',
            'product_id': 'MYN-DENIM-JACKET-99',
            'product_name': 'UrbanEdge Vintage Denim Jacket',
            'platform': 'Myntra',
            'reviewer_id': f'MYN_INF_{3000 + (i % 20)}',
            'rating': 5,
            'review_text': random.choice(fashion_boost_phrases),
            'timestamp': burst_time_3 + timedelta(minutes=random.randint(0, 24 * 60)),
            'verified_purchase': True
        })
    for i in range(30):
        data.append({
            'review_id': f'REV_MYN_ORG_{i:04d}',
            'product_id': 'MYN-DENIM-JACKET-99',
            'product_name': 'UrbanEdge Vintage Denim Jacket',
            'platform': 'Myntra',
            'reviewer_id': f'MYN_BUYER_{random.randint(5000, 9999)}',
            'rating': random.choices([2, 3, 4], weights=[0.3, 0.4, 0.3])[0],
            'review_text': random.choice([
                "Color was slightly darker than shown in photos.",
                "Sleeves are a bit tight around the cuffs.",
                "Good everyday jacket, denim is sturdy.",
                "Buttons feel slightly loose after first wash."
            ]),
            'timestamp': base_time + timedelta(days=random.randint(0, 30)),
            'verified_purchase': True
        })

    # ==========================================
    # Case 4: Google Play App Reviews (Coordinated 1-Star Review Bomb)
    # Target: GP-FINTECH-APP-SEC
    # Platform: Google Play
    # ==========================================
    burst_time_4 = base_time + timedelta(days=22, hours=11)
    review_bomb_phrases = [
        "Scam app! Stole my money and customer care blocked my number! Do not download!",
        "Total fraud app, stole my money and support blocked my number! Beware!",
        "Do not download this scam app! They took my deposit and blocked my account.",
        "Worst banking app ever, complete fraud, customer support never answers!"
    ]
    for i in range(90):
        data.append({
            'review_id': f'REV_GP_{i:04d}',
            'product_id': 'GP-FINTECH-APP-SEC',
            'product_name': 'SwiftPay Digital Wallet & Vault',
            'platform': 'Google Play',
            'reviewer_id': f'GP_BOMB_{4000 + (i % 30)}',
            'rating': 1,
            'review_text': random.choice(review_bomb_phrases),
            'timestamp': burst_time_4 + timedelta(minutes=random.randint(0, 16 * 60)),
            'verified_purchase': False
        })
    for i in range(40):
        data.append({
            'review_id': f'REV_GP_ORG_{i:04d}',
            'product_id': 'GP-FINTECH-APP-SEC',
            'product_name': 'SwiftPay Digital Wallet & Vault',
            'platform': 'Google Play',
            'reviewer_id': f'GP_USER_{random.randint(5000, 9999)}',
            'rating': random.choices([4, 5], weights=[0.4, 0.6])[0],
            'review_text': random.choice([
                "Clean UI and transfers are very fast.",
                "Biometric login works seamlessly on Android 14.",
                "Wish there were more cashback partner merchants.",
                "Simple, reliable, no complaints."
            ]),
            'timestamp': base_time + timedelta(days=random.randint(0, 30)),
            'verified_purchase': True
        })

    # ==========================================
    # Case 5: Organic Control Case (Natural Diverse Reviews)
    # Target: ORG-COFFEE-MAKER-05
    # Platform: Amazon
    # ==========================================
    organic_texts = [
        "Makes a solid cup of coffee every morning. Easy to clean the filter basket.",
        "Timer function is handy, though the heating plate turns off a bit early.",
        "Great upgrade from my old French press. Brews quickly.",
        "Takes up minimal counter space. Instructions were straightforward.",
        "Coffee temperature could be a few degrees hotter, but overall satisfied.",
        "Good value drip coffee maker for daily family use.",
        "Glass carafe feels durable and doesn't drip when pouring.",
        "Auto shut-off feature gives peace of mind when rushing out.",
        "Arrived well packed and worked right out of the box.",
        "Standard machine, does what it advertises without unnecessary bells and whistles."
    ]
    for i in range(120):
        data.append({
            'review_id': f'REV_ORG_{i:04d}',
            'product_id': 'ORG-COFFEE-MAKER-05',
            'product_name': 'AromaCraft Artisan 12-Cup Coffee Brewer',
            'platform': 'Amazon',
            'reviewer_id': f'ORG_BUYER_{random.randint(7000, 9999)}',
            'rating': random.choices([1, 2, 3, 4, 5], weights=[0.05, 0.08, 0.22, 0.40, 0.25])[0],
            'review_text': random.choice(organic_texts),
            'timestamp': base_time + timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59)),
            'verified_purchase': random.choices([True, False], weights=[0.85, 0.15])[0]
        })

    df = pd.DataFrame(data)

    # Introduce realistic edge cases: minor whitespace, a couple of empty strings and duplicates
    df.loc[10:12, 'review_text'] = np.nan
    df.loc[25:27, 'review_text'] = "   "
    df = pd.concat([df, df.iloc[50:53]])

    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    output_path = '../data/amazon_reviews_synthetic.csv'
    df.to_csv(output_path, index=False)
    print(f"Synthesized {len(df)} records across 5 benchmark cases into {output_path}")

if __name__ == "__main__":
    generate_synthetic_reviews()
