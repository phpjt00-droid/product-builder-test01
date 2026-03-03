// Selectors
const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');
const themeToggle = document.getElementById('theme-toggle');
const startBtn = document.getElementById('start-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const labelContainer = document.getElementById('label-container');

// Teachable Machine Config
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/Qd49IN6Rt/";
let model, webcam, maxPredictions;

// --- Animal Test Functions ---

async function initAnimalTest() {
  startBtn.classList.add('hidden');
  loadingSpinner.classList.remove('hidden');

  try {
    const modelURL = MODEL_URL + "model.json";
    const metadataURL = MODEL_URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();
    
    loadingSpinner.classList.add('hidden');
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement("div"));
    }
  } catch (error) {
    console.error("Model load failed:", error);
    loadingSpinner.textContent = "카메라 권한이 필요하거나 모델을 불러올 수 없습니다.";
    startBtn.classList.remove('hidden');
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    const className = prediction[i].className;
    const probability = (prediction[i].probability * 100).toFixed(0);
    labelContainer.childNodes[i].innerHTML = `${className}: ${probability}%`;
    
    // Highlight highest probability
    if (prediction[i].probability > 0.5) {
        labelContainer.childNodes[i].style.color = "var(--primary-btn-bg)";
    } else {
        labelContainer.childNodes[i].style.color = "inherit";
    }
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
startBtn.addEventListener('click', initAnimalTest);

// Initial Setup
initTheme();
generateNumbers();
