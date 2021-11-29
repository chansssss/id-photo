// import imageCompression from "browser-image-compression";
import Compressor from 'compressorjs';

/**
 * 读文件转成base64
 * @param {*} file
 * @return {*} 
 */
function file2Base64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}


/**
 * base64转file
 * @param {*} dataurl
 * @param {*} filename
 * @return {*} 
 */
function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1], bstr = window.atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


/**
 * 字节流转base64
 * @param {*} buffer
 * @return {*} 
 */
function arrayBufferToBase64(buffer) {
    var binary = "";
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

/**
 * blob 转文件
 * @param {*} theBlob
 * @param {*} fileName
 * @param {*} fileType
 * @return {*} 
 */
function blobToFile(theBlob, fileName, fileType) {
    return new window.File([theBlob], fileName, { type: fileType });
}

/**
 * 图片压缩
 * @param {*} file
 * @param {*} quality
 * @return {*} 
 */
async function picCompressor(file, quality = 0.6) {
    // const options = {
    //     maxSizeMB: maxSize,
    //     maxWidthOrHeight: 1920,
    //     useWebWorker: true
    // };
    // try {
    //     const compressedFile = await imageCompression(file, options);
    //     return blobToFile(compressedFile, `pic-${new Date().getTime()}.png`, compressedFile.type);
    // } catch (error) {
    //     console.log(error);
    //     return false
    // }
    return new Promise((resolve) => {
        new Compressor(file, {
            quality: quality,
            success(result) {
                console.log(result);
                resolve(result)
            },
            error(err) {
                console.log(err.message);
            },
        });
    })
}


export default {
    install: (Vue) => {
        Vue.prototype.$file2Base64 = file2Base64;
        Vue.prototype.$dataURLtoFile = dataURLtoFile;
        Vue.prototype.$arrayBufferToBase64 = arrayBufferToBase64;
        Vue.prototype.$blobToFile = blobToFile;
        Vue.prototype.$picCompressor = picCompressor;
    }
};