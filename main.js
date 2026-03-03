// Selectors
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const uploadIcon = document.getElementById('upload-icon');
const uploadText = document.getElementById('upload-text');
const labelContainer = document.getElementById('label-container');
const loadingSpinner = document.getElementById('loading-spinner');

// Teachable Machine Config
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Qd49IN6Rt/";
let model, maxPredictions;

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

  // Show preview
  const reader = new FileReader();
  reader.onload = async (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove('hidden');
    uploadIcon.classList.add('hidden');
    uploadText.classList.add('hidden');
    
    // Analyze
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
    
    // Sort predictions by probability
    prediction.sort((a, b) => b.probability - a.probability);

    for (let i = 0; i < maxPredictions; i++) {
      const className = prediction[i].className;
      const probability = (prediction[i].probability * 100).toFixed(0);
      
      const resultDiv = document.createElement('div');
      resultDiv.innerHTML = `<span>${className}</span> <span>${probability}%</span>`;
      
      // Highlight top result
      if (i === 0) {
        resultDiv.style.color = "var(--primary-btn-bg)";
        resultDiv.style.fontSize = "1.2em";
      }
      
      labelContainer.appendChild(resultDiv);
    }
  } catch (error) {
    console.error("Analysis failed:", error);
    loadingSpinner.textContent = "분석 중 오류가 발생했습니다.";
  }
}

// --- Lotto Functions ---

const generateNumbers = () => {
  lottoNumbersContainer.innerHTML = '';
  const numbers = new Set();
  while (numbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    numbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

  sortedNumbers.forEach((number, index) => {
    const numberElement = document.createElement('div');
    numberElement.className = 'lotto-number';
    numberElement.textContent = number;
    numberElement.style.animationDelay = `${index * 0.1}s`;
    lottoNumbersContainer.appendChild(numberElement);
  });
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

generateBtn.addEventListener('click', generateNumbers);
themeToggle.addEventListener('click', toggleTheme);
imageUpload.addEventListener('change', handleImageUpload);

// Initial Setup
initTheme();
generateNumbers();
