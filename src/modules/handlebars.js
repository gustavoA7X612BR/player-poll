const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

function getHBSTemplateFromFile(filename) {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, `../templates/emails/${filename}.hbs`),
    'utf8'
  );

  return handlebars.compile(emailTemplateSource);
}

module.exports = getHBSTemplateFromFile;
