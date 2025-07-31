const currencyList = {
  USD: { name: "United States Dollar", emoji: "🇺🇸" },
  EUR: { name: "Euro", emoji: "🇪🇺" },
  GBP: { name: "British Pound Sterling", emoji: "🇬🇧" },
  NGN: { name: "Nigerian Naira", emoji: "🇳🇬" },
  CAD: { name: "Canadian Dollar", emoji: "🇨🇦" },
  AUD: { name: "Australian Dollar", emoji: "🇦🇺" },
  JPY: { name: "Japanese Yen", emoji: "🇯🇵" },
  CNY: { name: "Chinese Yuan", emoji: "🇨🇳" },
  INR: { name: "Indian Rupee", emoji: "🇮🇳" },
  ZAR: { name: "South African Rand", emoji: "🇿🇦" },
  BRL: { name: "Brazilian Real", emoji: "🇧🇷" },
  MXN: { name: "Mexican Peso", emoji: "🇲🇽" },
  RUB: { name: "Russian Ruble", emoji: "🇷🇺" },
  CHF: { name: "Swiss Franc", emoji: "🇨🇭" },
  SAR: { name: "Saudi Riyal", emoji: "🇸🇦" },
  SGD: { name: "Singapore Dollar", emoji: "🇸🇬" },
  NZD: { name: "New Zealand Dollar", emoji: "🇳🇿" },
  SEK: { name: "Swedish Krona", emoji: "🇸🇪" },
  NOK: { name: "Norwegian Krone", emoji: "🇳🇴" },
  DKK: { name: "Danish Krone", emoji: "🇩🇰" },
  BDT: { name: "Bangladeshi Taka", emoji: "🇧🇩" },
  PKR: { name: "Pakistani Rupee", emoji: "🇵🇰" },
  GHS: { name: "Ghanaian Cedi", emoji: "🇬🇭" },
  EGP: { name: "Egyptian Pound", emoji: "🇪🇬" },
  KES: { name: "Kenyan Shilling", emoji: "🇰🇪" },
  TZS: { name: "Tanzanian Shilling", emoji: "🇹🇿" }
};

function populateCurrencies() {
  const from = document.getElementById("fromCurrency");
  const to = document.getElementById("toCurrency");

  for (const code in currencyList) {
    const info = currencyList[code];
    const label = `${info.emoji} ${code} – ${info.name}`;

    const opt1 = document.createElement("option");
    opt1.value = code;
    opt1.textContent = label;
    from.appendChild(opt1);

    const opt2 = document.createElement("option");
    opt2.value = code;
    opt2.textContent = label;
    to.appendChild(opt2);
  }

  from.value = "USD";
  to.value = "NGN";
}

async function convertCurrency() {
  const amount = Number(document.getElementById('amount').value);
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  const resultBox = document.getElementById('result');

  resultBox.classList.remove('error');

  if (!amount || amount <= 0) {
    resultBox.innerText = "Please enter a valid amount.";
    resultBox.classList.add('error');
    return;
  }

  if (from === to) {
    resultBox.innerText = "Select two different currencies.";
    resultBox.classList.add('error');
    return;
  }

  resultBox.innerText = 'Converting...';

  const apiKey = 'f9d79e361b0b6909b9cb8534';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${from}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');

    const data = await response.json();

    if (data.result !== 'success') {
      resultBox.innerText = 'API error: ' + data['error-type'];
      resultBox.classList.add('error');
      return;
    }

    const rate = data.conversion_rates[to];
    if (!rate) {
      resultBox.innerText = `Conversion rate not found for ${to}`;
      resultBox.classList.add('error');
      return;
    }

    const convertedAmount = amount * rate;
    resultBox.innerText = `${amount.toFixed(2)} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
  } catch (error) {
    console.error(error);
    resultBox.innerText = 'Error fetching exchange rate.';
    resultBox.classList.add('error');
  }
}

function createThemeToggle() {
  const btn = document.createElement('button');
  btn.id = 'themeToggle';
  btn.title = 'Toggle light/dark mode';

  // Sun icon (light mode)
  btn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="6.36"/>
    </svg>
  `;

  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    // Save preference
    if(document.body.classList.contains('dark-theme')){
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  document.body.appendChild(btn);
}

document.addEventListener("DOMContentLoaded", () => {
  // Set theme from localStorage or default to light
  if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }

  populateCurrencies();
  document.getElementById('convertBtn').addEventListener('click', convertCurrency);
  document.getElementById('swapBtn').addEventListener('click', () => {
    const fromSelect = document.getElementById('fromCurrency');
    const toSelect = document.getElementById('toCurrency');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
  });

  createThemeToggle();
});
