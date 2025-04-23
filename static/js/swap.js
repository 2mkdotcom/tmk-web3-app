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
  