import { ImagePool } from '@squoosh/lib';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const imagePool = new ImagePool(1);

const encodeOptions = {
    mozjpeg: { quality: 47 }, //an empty object means 'use default settings'
};

async function imgCompress(file, encodeOptions = encodeOptions) {
    const image = imagePool.ingestImage(file);
    await image.decoded;
    await image.encode(encodeOptions);
    let rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
    return rawEncodedImage
}

async function imgRemoveBg(inputPath) {
    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));

    let response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        responseType: 'arraybuffer',
        headers: {
            ...formData.getHeaders(),
            'X-Api-Key': '83PUtx7RiJzqqZhwDv3973vG',
        },
        encoding: null
    }) 

    return response.data
}

export {
    imgRemoveBg
}