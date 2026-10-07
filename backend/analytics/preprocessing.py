import pandas as pd
import numpy as np

def load_and_preprocess_data(filepath: str) -> pd.DataFrame:
    """
    Loads raw review CSV and performs preprocessing:
    - missing value handling
    - duplicate removal
    - empty text removal
    - timestamp conversion
    - text normalization
    """
    try:
        df = pd.read_csv(filepath)
    except Exception as e:
        raise RuntimeError(f"Failed to load dataset: {str(e)}")

    # 1. Duplicate removal
    df = df.drop_duplicates()

    # 2. Missing value & empty text handling
    # Drop rows where essential fields are missing
    df = df.dropna(subset=['review_id', 'product_id', 'reviewer_id'])
    
    # Handle missing/empty review text
    df['review_text'] = df['review_text'].fillna('')
    df = df[df['review_text'].str.strip() != '']

    # 3. Timestamp conversion
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])

    # 4. Text Normalization (Keep original for UI, create normalized version for analysis)
    df['review_text_original'] = df['review_text']
    df['review_text_norm'] = df['review_text'].str.lower()
    df['review_text_norm'] = df['review_text_norm'].str.replace(r'[^\w\s]', '', regex=True)

    # Reset index after drops
    df = df.reset_index(drop=True)
    
    return df

if __name__ == "__main__":
    # Test the preprocessor
    df = load_and_preprocess_data('../../data/amazon_reviews_synthetic.csv')
    print(f"Preprocessed {len(df)} reviews successfully.")
    print(df.head())
