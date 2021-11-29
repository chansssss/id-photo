import { ImagePool } from '@squoosh/lib';

const imagePool = new ImagePool(1);
const encodeOptions = {
    mozjpeg: { quality: 47 },
};

/**
 *
 *
 * @param {*} file
 * @return {*} byte
 */
async function imgCompress(file) {
    const image = imagePool.ingestImage(file);
    await image.decoded;
    await image.encode(encodeOptions);
    let rawEncodedImage = (await image.encodedWith.mozjpeg).binary;
    return rawEncodedImage
}

export {
    imgCompress
}