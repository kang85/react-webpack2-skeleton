var fs = require('fs');

export default function(file, callback) {
    try {
        var fileContent = fs.readFileSync(`build/assets/${file}`, 'utf8').toString();
    } catch(e) {
        console.log(e.message);
    }

    callback(null, {
        statusCode: 200,
        headers: { "Content-type": "application/javascript" },
        body: fileContent
    });
}