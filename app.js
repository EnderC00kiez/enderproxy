// expressjs
var express = require('express');
const http = require('https');

function is_url(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    var reletave = new RegExp('^\\/([a-z\\d%_.~+]+\\/)*([a-z\\d%_.~+]+)?(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','gi');
    if(!pattern.test(str) && !reletave.test(str)) {
        return false;
    } else {
        return true;
    }
}

var reletave = new RegExp('^\\/([a-z\\d%_.~+]+\\/)*([a-z\\d%_.~+]+)?(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','gi',);

function sendData(res, data) {
    // replace with regex
    console.log(data.replaceAll(reletave, function(match) {
        // replace all matches with /proxy/{currentsite}/{match}
        return '/proxy/' + window.location.host + match;
        }))
    res.send(data);
}


app = express();

// simple endpoint
app.get('/', function(req, res) {
  // send index.html
    res.sendFile(__dirname + '/pages/index.html');
});

app.get('/enderproxy/scripts/rewrite.js', function(req, res) {
    // send rewrite.js
    res.sendFile(__dirname + '/scripts/rewrite.js');
});
// everything in scripts folder should be served
app.get('/proxy/*', function(req, res) {
    // get url (after /proxy/)
    var url = req.url.substring(7);
    // send request to url
    http.get(url, (resp) => {
        let data = '';
        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // if response code is 200, send data
            if (resp.statusCode == 200) {
                sendData(res, data);
            } else if (resp.statusCode == 301) {
                // if response code is 301, redirect
                http.get(resp.headers.location, (resp) => {
                    let data = '';
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        // if response code is 200, send data
                        if (resp.statusCode == 200) {
                            sendData(res, data);
                        } else {
                            res.send(resp.statusCode);
                        }
                    });
                }, (err) => {
                    console.log("Error: " + err.message);
                });
            }
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
    });

})

// start server
app.listen(3000, function() {
    console.log('Started EnderProxy instance on port 3000');
    });