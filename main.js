// --- Selectors ---
const views = document.querySelectorAll('.view');
const homeView = document.getElementById('home-view');
const animalTestView = document.getElementById('animal-test-view');
const lottoView = document.getElementById('lotto-view');

const appLogo = document.getElementById('app-logo');
const goAnimalBtn = document.getElementById('go-animal-test');
const goLottoBtn = document.getElementById('go-lotto');
const backBtns = document.querySelectorAll('.back-btn');

const themeToggle = document.getElementById('theme-toggle');
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadIcon = document.getElementById('upload-icon');
const uploadText = document.getElementById('upload-text');
const labelContainer = document.getElementById('label-container');
const loadingSpinner = document.getElementById('loading-spinner');

// Teachable Machine Config
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Qd49IN6Rt/";
let model, maxPredictions;

// --- Router Logic ---

const switchView = (targetId) => {
  views.forEach(view => {
    if (view.id === targetId) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });
  window.scrollTo(0, 0);
};

// --- Animal Test Functions ---

async function loadModel() {
  if (!model) {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
  }
}

async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove('hidden');
    uploadIcon.classList.add('hidden');
    uploadText.classList.add('hidden');
    await analyzeImage();
  };
  reader.readAsDataURL(file);
}

async function analyzeImage() {
  loadingSpinner.classList.remove('hidden');
  labelContainer.innerHTML = '';
  
  try {
    await loadModel();
    const prediction = await model.predict(imagePreview);
    loadingSpinner.classList.add('hidden');
    
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
      const className = prediction[i].className;
      const probability = (prediction[i].probability * 100).toFixed(0);
      const resultDiv = document.createElement('div');
      resultDiv.innerHTML = `<span>${className}</span> <span>${probability}%</span>`;
      if (i === 0) resultDiv.style.fontWeight = "bold";
      labelContainer.appendChild(resultDiv);
    }
  } catch (error) {
    loadingSpinner.textContent = "분석 중 오류가 발생했습니다.";
  }
}

// --- Lotto Functions ---

const generateNumbers = () => {
  lottoNumbersContainer.innerHTML = '';
  const numbers = new Set();
  
  // Pick 7 unique numbers
  while (numbers.size < 7) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  
  const numbersArray = Array.from(numbers);
  const mainNumbers = numbersArray.slice(0, 6).sort((a, b) => a - b);
  const bonusNumber = numbersArray[6];

  // Create main numbers
  mainNumbers.forEach((number, index) => {
    const ball = document.createElement('div');
    ball.className = 'lotto-number';
    ball.textContent = number;
    ball.style.animationDelay = `${index * 0.15}s`;
    lottoNumbersContainer.appendChild(ball);
  });

  // Create plus sign
  const plus = document.createElement('div');
  plus.className = 'lotto-plus';
  plus.textContent = '+';
  plus.style.animationDelay = '1s';
  lottoNumbersContainer.appendChild(plus);

  // Create bonus number
  const bonusBall = document.createElement('div');
  bonusBall.className = 'lotto-number bonus';
  bonusBall.textContent = bonusNumber;
  bonusBall.style.animationDelay = '1.2s';
  lottoNumbersContainer.appendChild(bonusBall);
};

// --- Theme Functions ---

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
};

const toggleTheme = () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
};

// --- Event Listeners ---

appLogo.addEventListener('click', () => switchView('home-view'));
goAnimalBtn.addEventListener('click', () => switchView('animal-test-view'));
goLottoBtn.addEventListener('click', () => switchView('lotto-view'));
backBtns.forEach(btn => btn.addEventListener('click', () => switchView('home-view')));

themeToggle.addEventListener('click', toggleTheme);
generateBtn.addEventListener('click', generateNumbers);
imageUpload.addEventListener('change', handleImageUpload);

// --- Initialization ---
initTheme();
generateNumbers();
switchView('home-view');
