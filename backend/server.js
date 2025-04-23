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
