module.exports = {
    saveHandler: function(req, res) {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
          var querystring = require('querystring');
          console.log(querystring.parse(body));
          res.end('ok');
        });
      }
      return body;
    }
}
