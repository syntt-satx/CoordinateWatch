// WatchLens Popup Logic

const BACKEND_URL = 'http://localhost:8000/api/scan';
const DASHBOARD_URL = 'http://localhost:5173/';

const initialState = document.getElementById('initial-state');
const loadingState = document.getElementById('loading-state');
const resultsState = document.getElementById('results-state');
const errorState = document.getElementById('error-state');

const scanBtn = document.getElementById('scan-btn');
const rescanBtn = document.getElementById('rescan-btn');
const retryBtn = document.getElementById('retry-btn');
const openDashBtn = document.getElementById('open-dash-btn');

const resCount = document.getElementById('res-count');
const resLevel = document.getElementById('res-level');
const resScore = document.getElementById('res-score');
const signalsList = document.getElementById('signals-list');
const errorMsg = document.getElementById('error-msg');

function showState(state) {
  initialState.classList.add('hidden');
  loadingState.classList.add('hidden');
  resultsState.classList.add('hidden');
  errorState.classList.add('hidden');

  state.classList.remove('hidden');
}

async function runScan() {
  showState(loadingState);

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) throw new Error("Could not access active browser tab.");

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_REVIEWS' }, async (response) => {
      if (chrome.runtime.lastError || !response || !response.reviews || response.reviews.length === 0) {
        // Fallback demo batch if page has no reviews
        const demoReviews = [
          "Absolutely amazing product, highly recommended. Fast shipping.",
          "Absolutely amazing product, highly recommended. Will buy again.",
          "Good item, as described.",
          "Not worth the price, broke after 2 days."
        ];
        await analyzeReviews(demoReviews, true);
        return;
      }

      await analyzeReviews(response.reviews, false);
    });
  } catch (err) {
    showError(err.message);
  }
}

async function analyzeReviews(reviews, isFallback = false) {
  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviews })
    });

    if (!res.ok) {
      throw new Error(`Engine error: HTTP ${res.status}`);
    }

    const data = await res.json();
    displayResults(data, reviews.length, isFallback);
  } catch (err) {
    showError("Could not reach CoordinateWatch backend at http://localhost:8000. Ensure the FastAPI server is running.");
  }
}

function displayResults(data, count, isFallback) {
  resCount.innerText = count + (isFallback ? " (Sample)" : "");
  resScore.innerText = data.overallRiskScore;

  resLevel.innerText = data.riskClassification;
  resLevel.className = `risk-badge ${data.riskClassification}`;

  // Populate signals
  signalsList.innerHTML = '';
  if (data.commonPhrases && data.commonPhrases.length > 0) {
    const li = document.createElement('li');
    li.innerHTML = `⚠️ <b>Phrase Cloning:</b> "${data.commonPhrases[0]}"`;
    signalsList.appendChild(li);
  }
  if (data.overallRiskScore > 50) {
    const li = document.createElement('li');
    li.innerHTML = `⚠️ <b>Syntactic Repetition:</b> Elevated cross-review correlation`;
    signalsList.appendChild(li);
  } else {
    const li = document.createElement('li');
    li.innerHTML = `✅ <b>Organic Distribution:</b> Normal linguistic entropy`;
    signalsList.appendChild(li);
  }

  showState(resultsState);
}

function showError(msg) {
  errorMsg.innerText = msg;
  showState(errorState);
}

scanBtn.addEventListener('click', runScan);
rescanBtn.addEventListener('click', runScan);
retryBtn.addEventListener('click', runScan);

openDashBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
});
