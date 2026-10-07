// WatchLens Content Script - Review Extraction Adapters

function extractReviews() {
  const hostname = window.location.hostname;
  let reviews = [];

  // Adapter 1: Amazon Review Pages
  if (hostname.includes('amazon')) {
    const reviewElements = document.querySelectorAll('[data-hook="review-body"], .review-text-content');
    reviewElements.forEach(el => {
      const text = el.innerText.trim();
      if (text.length > 5) reviews.push(text);
    });
  }
  
  // Adapter 2: Generic / Fallback Extraction
  if (reviews.length === 0) {
    const selectors = [
      '.review-text', '.user-review', '.comment-text', 
      '[class*="review-content"]', '[class*="review-body"]',
      'blockquote', '.review'
    ];
    for (const sel of selectors) {
      const els = document.querySelectorAll(sel);
      if (els.length >= 2) {
        els.forEach(el => {
          const t = el.innerText.trim();
          if (t.length > 10) reviews.push(t);
        });
        break;
      }
    }
  }

  // Fallback: If no structured reviews, extract visible paragraphs of reasonable length
  if (reviews.length === 0) {
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      const t = p.innerText.trim();
      if (t.length > 30 && t.length < 500) reviews.push(t);
    });
    reviews = reviews.slice(0, 30); // Cap fallback sample
  }

  return reviews;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'EXTRACT_REVIEWS') {
    const reviews = extractReviews();
    sendResponse({ reviews, count: reviews.length, url: window.location.href });
  }
  return true;
});
