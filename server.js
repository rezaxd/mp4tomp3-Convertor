const fs = require('fs');
const converter = require('video-converter');
const fileUpload = require('express-fileupload');
const express = require('express');
const path = require('path');

var app = express();

app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('index')
})

converter.setFfmpegPath('/usr/bin/ffmpeg', (err) => {
    if (err) console.log(err)
    else console.log('\n[*] ffmepg loaded successfully!\n');
})

app.post('/upload', (req, res) => {
    if (req.files.fupload) {
        inputName = `./media/${req.files.fupload.name}`;
        outName = './media/' + req.files.fupload.name.split('.')[0] + '.mp3';
        console.log('[*] Writing file into disk...');
        fs.writeFile(`./media/${req.files.fupload.name}`, req.files.fupload.data, (err) => {
            if (err) console.log(err);
        });
        console.log(`[*] Converting ${req.files.fupload.name} to mp3 ...`);
        converter.convert(inputName, outName, (err) => {
            if (err) console.log(err);
            else {
                fs.exists(outName, (exists) => {
                    if (exists) {
                        console.log(`[*] ${req.files.fupload.name} converted successfulllyyy!`);
                    } else {
                        console.log('[*] error occured during convert!'); 
                    }
                    
                });
            }
        });
    }
    res.redirect('/');
});

app.listen(3000, () => {
	console.log("[*] listening on port 3000");
})