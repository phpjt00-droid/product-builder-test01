const lottoNumbersContainer = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');

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

generateBtn.addEventListener('click', generateNumbers);

// Initial generation
generateNumbers();
