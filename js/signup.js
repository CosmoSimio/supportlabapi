document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();
  var username = document.getElementById('signup-username').value;
  var email = document.getElementById('signup-email').value;
  var password = document.getElementById('signup-password').value;
  
  // Validate email address
  if (!email.match(/^[a-zA-Z0-9._%+-]+@logicmonitor\.com$/)) {
    alert('Please enter a valid email address from the LogicMonitor domain.');
    return;
  }
  
  var attributeList = [
    new AmazonCognitoIdentity.CognitoUserAttribute({
      Name: 'email',
      Value: email
    })
  ];
  
  userPool.signUp(username, password, attributeList, null, function(err, result) {
    if (err) {
      console.log('Sign-up failed: ' + err);
    } else {
      console.log('Sign-up successful');
      // Redirect to your verification page
      window.location.href = 'verify.html';
    }
  });
});