function generateLmv1Token() {
  const access_id = document.getElementById("access_id").value;
  const access_key = document.getElementById("access_key").value;

  // Concatenate Access ID and Access Key with a colon
  const message = `${access_id}:${access_key}`;

  // Create an SHA256 hash of the message using Access Key as the key
  const sha256_hash = CryptoJS.HmacSHA256(message, access_key).toString();

  // Base64-encode the hash
  const base64_hash = btoa(hexToBytes(sha256_hash));

  // Concatenate Access ID, colon, and Base64-encoded hash with a colon
  const lmv1_token = `LMv1 ${access_id}:${base64_hash}:`;

  // Display the LMv1 token on the page
  document.getElementById("lmv1_token").innerHTML = `Your LMv1 token is: <code>${lmv1_token}</code>`;
}

// Helper function to convert a hex string to a byte array
function hexToBytes(hex) {
  const bytes = [];

  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(parseInt(hex.substr(i, 2), 16));
  }

  return bytes;
}

// Add event listener to the Generate Token button
const generateTokenButton = document.getElementById("generate_token");
generateTokenButton.addEventListener("click", generateLmv1Token);