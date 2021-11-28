import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import fs from 'fs/promises';
const imagePool = new ImagePool(cpus().length);

async function imgCompress(file) {
    const image = imagePool.ingestImage(file);
    await image.decoded; //Wait until the image is decoded before running preprocessors.
    const encodeOptions = {
        mozjpeg: {}, //an empty object means 'use default settings'
        jxl: {
            quality: 90,
        },
    };
    await image.encode(encodeOptions);
    const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
    await imagePool.close();
    return rawEncodedImage
}

import express from 'express';
const app = express()
const port = 3000

app.get('/', async (req, res) => {
    const file = await fs.readFile('test.png');
    let binary = await imgCompress(file)
    res.writeHead(200, {
        'Content-Type': 'image/jpeg'
    });
    res.end(Buffer.from(binary), 'binary');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})