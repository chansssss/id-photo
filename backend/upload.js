import express from 'express';
import cors from 'cors'
import fileUpload from 'express-fileupload';
import path from 'path'
import fs from 'fs/promises';
import { imgRemoveBg } from "./img-utils.js";

const __dirname = path.resolve()
const app = express();

// default options
app.use(fileUpload());

app.post('/removebg',cors(), async function (req, res) {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    sampleFile = req.files.file;
    uploadPath = __dirname + '/' + sampleFile.name; 
    sampleFile.mv(uploadPath,async function (err) {
        if (err)
            return res.status(500).send(err);
        let binary = await imgRemoveBg(uploadPath)
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(Buffer.from(binary), 'binary');
    });
});


app.post('/compressor',cors(), async function (req, res) {
    let sampleFile;
    let uploadPath;

    console.log(req.body);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.file;
    uploadPath = __dirname + '/' + sampleFile.name; 
    console.log(uploadPath);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath,async function (err) {
        if (err)
            return res.status(500).send(err);
        const file = await fs.readFile(uploadPath);
        let binary = await imgCompress(file)
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(Buffer.from(binary), 'binary');
        // res.send('sussess')
    });
    
    console.log(sampleFile);

});



app.listen(3030, () => {
    console.log(`Example app listening at http://localhost:${3030}`)
})