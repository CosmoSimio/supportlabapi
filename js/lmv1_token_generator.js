function generateEncodedLmv1Token(accessId, accessKey) {
  // Get current time in Unix epoch format
  var timestamp = Math.floor(Date.now() / 1000);

  // Construct message to sign
  var message = accessId + "\n" + timestamp + "\n";

  // Generate signature using CryptoJS.HmacSHA256
  var signature = CryptoJS.HmacSHA256(message, accessKey);

  // Convert signature to Base64
  var signatureBase64 = CryptoJS.enc.Base64.stringify(signature);

  // Construct LMv1 token
  var lmv1Token = "LMv1 " + accessId + ":" + signatureBase64 + ":" + timestamp;

  // Encode LMv1 token using encodeURIComponent
  var encodedToken = encodeURIComponent(lmv1Token);

  return encodedToken;
}

function copyToClipboard(id) {
  var text = document.getElementById(id).value;
  var textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showCopyConfirmation();
}

function showCopyConfirmation() {
  var confirmationDiv = document.getElementById("copy_confirmation");
  confirmationDiv.innerHTML = "LMv1 token copied to clipboard!";
  confirmationDiv.style.display = "block";
}

function generateLmv1Token() {
  var accessId = document.getElementById("access_id").value;
  var accessKey = document.getElementById("access_key").value;
  var lmv1Token = generateEncodedLmv1Token(accessId, accessKey);
  document.getElementById("lmv1_token").value = lmv1Token;
}

function resetCopyConfirmation() {
  var confirmationDiv = document.getElementById("copy_confirmation");
  confirmationDiv.style.display = "none";
}