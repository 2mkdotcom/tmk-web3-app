Absolutely! Here's the **entire Too Much Koffee Web3 App** packaged as a full, organized project — just **copy and paste** the folder structure and files into your own environment (e.g., VS Code), and you'll be ready to deploy or commit to GitHub.

---

# ☕ **Too Much Koffee Web3 App**

---

## 📁 Project Structure

```
TooMuchKoffeeSite/
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── theme-toggle.js
│   │   └── swap.js
│   ├── img/
│       └── [Your logo image]
├── index.html
├── swap.html
├── crypto_prices.html
├── portfolio.html
├── README.md
├── .github/
│   └── workflows/
│       └── deploy.yml
```

---

## 📄 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Too Much Koffee ☕</title>
  <link rel="stylesheet" href="static/css/style.css">
</head>
<body>
  <div class="header">
    <img src="static/img/tmk-logo-thumb.png" alt="Too Much Koffee Logo" class="logo" />
    <h1 style="font-family: Comic Sans MS;">Too Much Koffee</h1>
    <button onclick="toggleTheme()">☀️/🌙</button>
  </div>

  <nav>
    <a href="swap.html">Swap</a>
    <a href="crypto_prices.html">Prices</a>
    <a href="portfolio.html">Portfolio</a>
  </nav>

  <main>
    <p>Welcome to the crypto toolkit powered by caffeine and code.</p>
    <p>Currency conversions, portfolio tracking, blockchain swaps, and bad coffee jokes.</p>
  </main>

  <script src="static/js/theme-toggle.js"></script>
</body>
</html>
```

---

## 📄 `swap.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swap | TMK</title>
  <link rel="stylesheet" href="static/css/style.css">
</head>
<body>
  <h2>Swap Crypto</h2>
  <form onsubmit="event.preventDefault(); swapCrypto();">
    <input type="number" id="swapAmount" placeholder="Amount" step="0.01">
    <select id="blockchain">
      <option value="solana">Solana</option>
      <option value="ethereum">Ethereum</option>
    </select>
    <button type="submit">Swap</button>
  </form>
  <p id="swap-result"></p>
  <script src="static/js/swap.js"></script>
</body>
</html>
```

---

## 📄 `crypto_prices.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prices | TMK</title>
</head>
<body>
  <h2>Live Crypto Prices</h2>
  <iframe src="https://widget.coinlib.io/widget?type=full_v2" width="100%" height="600px" frameborder="0"></iframe>
</body>
</html>
```

---

## 📄 `portfolio.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Portfolio | TMK</title>
  <script src="https://cdn.jsdelivr.net/npm/web3@1.10.0/dist/web3.min.js"></script>
</head>
<body>
  <h1>Your Wallet Portfolio</h1>
  <button onclick="connectWallet()">Connect MetaMask</button>
  <p id="wallet-address"></p>
  <p id="eth-balance"></p>

  <script>
    async function connectWallet() {
      if (window.ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const wallet = accounts[0];
        document.getElementById("wallet-address").innerText = `Connected: ${wallet}`;
        const web3 = new Web3(window.ethereum);
        const balance = await web3.eth.getBalance(wallet);
        document.getElementById("eth-balance").innerText = `ETH: ${web3.utils.fromWei(balance)} ETH`;
      } else {
        alert("Install MetaMask!");
      }
    }
  </script>
</body>
</html>
```

---

## 📄 `static/js/swap.js`

```javascript
async function swapCrypto() {
  const amount = parseFloat(document.getElementById("swapAmount").value);
  const blockchain = document.getElementById("blockchain").value;
  const url = blockchain === "solana" ? "/api/swap/solana" : "/api/swap/ethereum";

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount })
  });

  const data = await res.json();
  document.getElementById("swap-result").innerText = data.success
    ? `✅ Success! Ref: ${data.signature || data.txHash}`
    : `❌ Error: ${data.error}`;
}
```

---

## 📄 `static/js/theme-toggle.js`

```javascript
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}
```

---

## 📄 `static/css/style.css`

```css
body {
  font-family: Arial, sans-serif;
  background-color: white;
  color: black;
  padding: 20px;
}
body.dark-mode {
  background-color: #111;
  color: white;
}
.logo {
  height: 64px;
}
nav a {
  margin: 0 15px;
}
```

---

## 📁 `backend/`

### 📄 `package.json`

```json
{
  "name": "tmk-backend",
  "version": "1.0.0",
  "main": "server.js",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "web3": "^1.10.0",
    "@solana/web3.js": "^1.73.2"
  }
}
```

### 📄 `.env.example`

```env
PORT=3000
SOL_PRIVATE_KEY=[your_solana_key_array]
SOL_RECEIVER=[solana_address]
ETH_PRIVATE_KEY=[eth_private_key]
ETH_RECEIVER=[eth_address]
INFURA_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
```

### 📄 `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Web3 = require('web3');
const { Connection, Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } = require('@solana/web3.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT;

// Solana Setup
const solConnection = new Connection("https://api.mainnet-beta.solana.com");
const solSecret = Uint8Array.from(JSON.parse(process.env.SOL_PRIVATE_KEY));
const solWallet = Keypair.fromSecretKey(solSecret);
const solReceiver = new PublicKey(process.env.SOL_RECEIVER);

// Ethereum Setup
const web3 = new Web3(process.env.INFURA_URL);
const ethAccount = web3.eth.accounts.privateKeyToAccount(process.env.ETH_PRIVATE_KEY);
web3.eth.accounts.wallet.add(ethAccount);

// Endpoints
app.post("/api/swap/solana", async (req, res) => {
  try {
    const lamports = parseFloat(req.body.amount) * LAMPORTS_PER_SOL;
    const tx = new Transaction().add(SystemProgram.transfer({
      fromPubkey: solWallet.publicKey,
      toPubkey: solReceiver,
      lamports
    }));
    const signature = await solConnection.sendTransaction(tx, [solWallet]);
    await solConnection.confirmTransaction(signature, "confirmed");
    res.json({ success: true, signature });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/swap/ethereum", async (req, res) => {
  try {
    const wei = web3.utils.toWei(req.body.amount.toString(), "ether");
    const tx = await web3.eth.sendTransaction({
      from: ethAccount.address,
      to: process.env.ETH_RECEIVER,
      value: wei
    });
    res.json({ success: true, txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
```

---

## 📄 `.github/workflows/deploy.yml`

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Upload to Hostinger
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          password: ${{ secrets.HOSTINGER_PASSWORD }}
          source: "."
          target: "public_html"
          strip_components: 1
```

---

Let me know if you'd like a landing page preview, a Solana airdrop faucet for testing, or Docker support too!