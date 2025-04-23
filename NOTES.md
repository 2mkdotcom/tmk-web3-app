Great! Here's a complete, step-by-step guide to build a Web3 Crypto & Fiat Converter + Portfolio Tracker website using Python + JavaScript, deploy it on Hostinger, and integrate MetaMask wallet support.

---

# 🧩 Project Overview

You'll build a:

1. Crypto & FIAT Converter – similar to coinstats.app

2. Portfolio Tracker – integrated with connected wallets like MetaMask

3. Hosted on Hostinger using Python (backend) and JavaScript (frontend)

---

# 🧱 TECHNOLOGIES USED

- Frontend: HTML, TailwindCSS, JavaScript (with Web3.js)
- Backend: Python (Flask or FastAPI)
- API for Rates: CoinGecko or CoinStats API
- Web3 Wallet: MetaMask using web3.js
- Deployment: Hostinger with Python support (via hPanel or VPS)

---

# 📁 1. PROJECT STRUCTURE

```vbnet
/crypto-converter/
│
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── portfolio.html
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
│       └── web3.js
│
├── .htaccess  (for Hostinger if using shared hosting)
├── runtime.txt
└── README.md
```
---

# 🧰 2. SETUP LOCALLY

## 🐍 Backend – Python + Flask

**Install Python Packages**

```bash

cd backend
python3 -m venv venv
source venv/bin/activate
pip install flask requests flask-cors
```
Create app.py

```python

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

# Get live rates from CoinGecko
@app.route('/api/convert')
def convert():
    from_currency = request.args.get('from')
    to_currency = request.args.get('to')
    amount = float(request.args.get('amount'))

    url = f'https://api.coingecko.com/api/v3/simple/price?ids={from_currency}&vs_currencies={to_currency}'
    response = requests.get(url).json()

    rate = response[from_currency][to_currency]
    converted = amount * rate
    return jsonify({'converted_amount': converted, 'rate': rate})

if __name__ == '__main__':
    app.run(debug=True)
```

**requirements.txt**

```nginx
flask
requests
flask-cors
```
---

# 🎨 Frontend – HTML + Tailwind + JS

**index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <title>Crypto Converter</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white p-10">
  <h1 class="text-3xl font-bold">Crypto & Fiat Converter</h1>

  <div class="mt-5">
    <input id="amount" type="number" placeholder="Amount" class="p-2 text-black" />
    <input id="from" type="text" placeholder="From (e.g., bitcoin)" class="p-2 text-black" />
    <input id="to" type="text" placeholder="To (e.g., usd)" class="p-2 text-black" />
    <button onclick="convert()" class="bg-blue-500 p-2">Convert</button>
    <p id="result" class="mt-4"></p>
  </div>

  <script src="js/main.js"></script>
</body>
</html>
```

**js/main.js**

```javascript

async function convert() {
  const amount = document.getElementById("amount").value;
  const from = document.getElementById("from").value.toLowerCase();
  const to = document.getElementById("to").value.toLowerCase();

  const res = await fetch(`http://localhost:5000/api/convert?from=${from}&to=${to}&amount=${amount}`);
  const data = await res.json();
  document.getElementById("result").innerText =
    `${amount} ${from} = ${data.converted_amount} ${to} @ rate ${data.rate}`;
}
```

#🔌 3. ADD METAMASK SUPPORT (in portfolio.html)

**portfolio.html**

```html

<!DOCTYPE html>
<html>
<head>
  <title>Portfolio Tracker</title>
</head>
<body class="bg-black text-white p-6">
  <button onclick="connectWallet()" class="bg-green-600 p-2">Connect Wallet</button>
  <p id="wallet-address" class="mt-4"></p>
  <script src="https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js"></script>
  <script src="js/web3.js"></script>
</body>
</html>
```

**js/web3.js**

```javascript

async function connectWallet() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      document.getElementById("wallet-address").innerText = `Connected: ${accounts[0]}`;
    } catch (err) {
      console.error("User rejected connection");
    }
  } else {
    alert("MetaMask not detected!");
  }
}
```
---

# ☁️ 4. DEPLOY TO HOSTINGER

**A. Using Shared Hosting (Python via CGI or via Flask with .htaccess)**

**Option 1: Use VPS or hPanel with Python support (Recommended)**

**1.Login to Hostinger**

**2. Go to hPanel → Websites → Manage → Advanced → SSH Access**

**3. SSH into your server**

```bash

ssh yourusername@yourhostingerIP
```

**4. Clone or upload your code:**

```bash

git clone your_repo_or_upload_files
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**5. Run the backend using Gunicorn or set it up via Hostinger's Python App manager.**

**Option 2: Frontend Only Deployment**

- Upload all your frontend files into public_html/

- For backend, you must use VPS, or deploy separately via PythonAnywhere or Render.

---

# 🔁 5. BACKEND ONLINE WITH REVERSE PROXY

**If using Gunicorn:**

```bash

gunicorn app:app --bind 0.0.0.0:8000
```

**Then configure Nginx (if on VPS) to proxy traffic:**

```nginx

server {
    listen 80;
    server_name yourdomain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
    }

    location / {
        root /home/username/public_html;
        index index.html;
    }
}
```
---

# 🎯 6. OPTIONAL: Portfolio API & Wallet Balance

**You can use:**

- Etherscan API to fetch token balances

- Alchemy / Infura for blockchain queries

- Or MetaMask provider directly for balance in web3.js

**Example:**

```javascript

const balance = await web3.eth.getBalance(accounts[0]);
const ethBalance = web3.utils.fromWei(balance, 'ether');
```
---

# ✅ 7. FINAL CHECKLIST

- Test conversion using CoinGecko

- Verify MetaMask connection

- Upload all frontend files to public_html/

- Deploy backend via VPS or external server

- Set up HTTPS (use Hostinger’s free SSL option)

---

# 📦 Bonus: Host the Backend Separately

If Hostinger doesn't support long-running Python processes on shared hosting, host the backend on:

- Render.com

- Railway.app

- PythonAnywhere

**Then update:**

```javascript

// main.js
fetch(`https://yourbackend.render.com/api/convert?...`)
```

# 🌓 Step-by-Step: Light/Dark Mode Toggle

# ✅ 1. Enable dark Mode in Tailwind

In your tailwind.config.js (if using Tailwind CLI or a build tool):

```js

module.exports = {
  darkMode: 'class', // important for toggle to work via class
  content: ["./**/*.html", "./js/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

If you're using CDN (like in your setup), you're good — no config needed!
---

# ✅ 2. Add Toggle Button to index.html

Inside the <body> of both index.html and portfolio.html, add a button:

```html

<button id="toggleTheme" class="fixed top-4 right-4 p-2 bg-gray-800 text-white rounded">
  🌙 Dark Mode
</button>
```
---

# ✅ 3. Update <html> Tag to Support Class Switching

**In index.html and portfolio.html, change the HTML tag like this:**

```html

<html lang="en" class="dark">
```

This allows you to dynamically remove or add the dark class.
---

# ✅ 4. Update Tailwind-Based Styling

**Update your body styles like this:**

```html

<body class="bg-white text-black dark:bg-gray-900 dark:text-white p-10">
```

Now Tailwind will auto-switch between light and dark.
---

# ✅ 5. Add Theme Toggle Script

**Add this inside main.js and web3.js (or shared file):**

```js

document.addEventListener('DOMContentLoaded', function () {
  const toggleBtn = document.getElementById('toggleTheme');
  const html = document.documentElement;

  // Check saved theme
  if (localStorage.getItem('theme') === 'light') {
    html.classList.remove('dark');
    toggleBtn.innerText = '🌙 Dark Mode';
  } else {
    html.classList.add('dark');
    toggleBtn.innerText = '☀️ Light Mode';
  }

  toggleBtn.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      toggleBtn.innerText = '🌙 Dark Mode';
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      toggleBtn.innerText = '☀️ Light Mode';
    }
  });
});
```
---

# ✅ Result

- Your site now supports toggling between Light and Dark themes

- Preference is stored in localStorage

- The theme remains persistent on reload

---

Let me know if you'd like an animated toggle switch (with a slider or icon morph), or a reusable component version!