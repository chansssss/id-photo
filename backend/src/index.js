import express from 'express';
import cors from 'cors'
import fileUpload from 'express-fileupload';
import config from './config/index.js'
import path from 'path'
import fs from 'fs/promises';
import md5 from 'blueimp-md5'
import { imgRemoveBg } from "./libs/removebg.js";
import { imgCompress } from "./libs/squoosh.js";
import { uploadFileMiddleware, removeTempDir,savePicToDisk,getPicByMd5 } from './utils/index.js'

const app = express();

app.use(fileUpload(config.get('fileupload')));

app.post('/removebg', cors(), async function (req, res) {
    let uploadPath = ''
    let data = null
    try {
        uploadPath = await uploadFileMiddleware(req)
        const contents = await fs.readFile(uploadPath, {encoding: 'base64'});
        data = await getPicByMd5(md5(contents))
        if (!data) {
            let binary = await imgRemoveBg(uploadPath)
            savePicToDisk(md5(contents),binary)
            data = Buffer.from(binary)
        }
        removeTempDir(path.dirname(uploadPath))
        res.writeHead(200, {
            'Content-Type': 'image/png'
        });
        res.end(data, 'binary');
    } catch (error) {
        console.log(error);
        removeTempDir(path.dirname(uploadPath))
        res.json(error)
    }
});

app.post('/compressor', cors(), async function (req, res) {
    let uploadPath = ''
    try {
        uploadPath = await uploadFileMiddleware(req)
        console.log(uploadPath);
        const file = await fs.readFile(uploadPath);
        let binary = await imgCompress(file)
        savePicToDisk(binary)
        removeTempDir(path.dirname(uploadPath))
        res.writeHead(200, {
            'Content-Type': 'image/jpeg'
        });
        res.end(Buffer.from(binary), 'binary');
    } catch (error) {
        console.log(error);
        removeTempDir(path.dirname(uploadPath))
        res.json(error)
    }
});



app.listen(3030, () => {
    console.log(`App listening at http://localhost:${3030}`)
})