var express = require('express');
var app = express();
var request = require('request');
var path = require('path');
var baseUrl = 'https://bibles.org/v2/eng-ESV/passages.js?q[]=';
var esvBaseUrl = 'https://api.esv.org/v3/passage/text?q=';
var token = process.env.token;
var esvToken = process.env.esvToken;

app.use(express.static('public'));
app.get('/', express.static(path.join(__dirname, 'public')));

app.get('/verse/:query', function(req, res) {
    request({url: esvBaseUrl + req.params.query,
        headers: {
            'Authorization': 'Token ' + esvToken
        }},

        function(err, response, body) {
            var result = '';
            if (!err)
            {
                console.log(body);
                var body = JSON.parse(body);
                if (body['passages'] != undefined)
                {
                    var passages = body['passages'];
                    passages.forEach(function(element)
                        {
                            result += element;
                        });
                }
                else 
                {
                    var errMsg = "No results for " + req.params.query;
                    res.end(errMsg);
                    console.log(errMsg);
                }
                res.end(JSON.stringify(result));
            }
            else
            {
                res.end("could not reach esv.org at this time");
            }
        });
});


app.get('/verse/v1/:query', function(req, res) {
    request({url: baseUrl + req.params.query, 
        auth: {
            'user': token,
            'pass': 'X'
        },
        'content-type': 'application/json'
    },

        function(err, response, body) {
            if (!err)
            {
                var body = JSON.parse(body);
                if (body['response'] != undefined 
                    && body['response']['search'] != undefined 
                    && body['response']['search']['result'] != undefined
                    && body['response']['search']['result']['passages'] != undefined
                    && body['response']['search']['result']['passages'].length > 0) {
                    console.log(body['response']['search']['result']['passages'].length);

                    var text = body['response']['search']['result']['passages'][0]['text'].replace(/h3/g, 'b');
                    var ref = body['response']['search']['result']['passages'][0]['display'];
                    var result = "<h3>" + ref + "</h3>" + text;

                    console.log("found results");
                } else {
                    var errMsg = "No results for " + req.params.query;
                    res.end(errMsg);
                    console.log(errMsg);
                }

                res.end(JSON.stringify(result));
            }
            else
            {
                res.end("could not reach bibles.org at this time");
            }
        });

});
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Up and running on port ' + port);
});
