import express from 'express';
import cors from 'cors'
import fileUpload from 'express-fileupload';
import config from './config/index.js'
import path from 'path'
import fs from 'fs/promises';
import { imgRemoveBg } from "./libs/removebg.js";
import { imgCompress } from "./libs/squoosh.js";
import { uploadFileMiddleware, removeTempDir } from './utils/index.js'

const app = express();

app.use(fileUpload(config.get('fileupload')));

app.post('/removebg', cors(), async function (req, res) {
    let uploadPath = ''
    try {
        uploadPath = await uploadFileMiddleware(req)
        let binary = await imgRemoveBg(uploadPath)
        removeTempDir(path.dirname(uploadPath))
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(Buffer.from(binary), 'binary');
    } catch (error) {
        removeTempDir(path.dirname(uploadPath))
        res.json(error)
    }
});

app.post('/credits', cors(), async function (req, res) {
    res.send(JSON.stringify(getAccount()))
});


app.post('/compressor', cors(), async function (req, res) {
    let uploadPath = ''
    try {
        uploadPath = await uploadFileMiddleware(req)
        const file = await fs.readFile(uploadPath);
        let binary = await imgCompress(file)
        removeTempDir(path.dirname(uploadPath))
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(Buffer.from(binary), 'binary');
    } catch (error) {
        removeTempDir(path.dirname(uploadPath))
        res.json(error)
    }
});



app.listen(3030, () => {
    console.log(`Example app listening at http://localhost:${3030}`)
})

console.log('This message is displayed first.');