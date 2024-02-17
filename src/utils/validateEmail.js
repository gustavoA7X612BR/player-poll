const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  return emailPattern.test(email);
}

module.exports = validateEmail;
