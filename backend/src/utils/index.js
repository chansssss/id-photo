import path from 'path'
import fs from 'fs';
import md5 from 'blueimp-md5'
const __dirname = path.resolve()

function uploadFileMiddleware(req) {
    return new Promise((resolve, reject) => {
        let sampleFile;
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0) {
            reject({
                code: 10003,
                msg: "缺少文件"
            });
        }
        sampleFile = req.files.file;
        fs.mkdtemp(path.join(__dirname, 'file-'), (err, folder) => {
            if (err) throw err;
            uploadPath = path.join(folder, sampleFile.name)
            sampleFile.mv(uploadPath, async function (err) {
                if (err) {
                    console.log(err);
                    reject({
                        code: 10004,
                        msg: "文件上传失败"
                    })
                }
                resolve(uploadPath)
            });
        });
    });
}

function removeTempDir(path) {
    if (path) {
        fs.rmSync(path, { recursive: true });
    }
}

const cachePath = path.join(__dirname, 'caches')
/**
 * 保存文件到磁盘
 *
 * @param {*} binary
 */
function savePicToDisk(md5, binary) {
    let buff = Buffer.from(binary);
    fs.writeFile(path.join(cachePath, `${md5}.png`), buff, "buffer", async function (err) {
    });
}

/**
 * 根据文件md5获取文件
 *
 * @param {*} md5
 */
function getPicByMd5(md5) {
    return new Promise((resolve, reject) => {
        let filePath = path.join(cachePath, `${md5}.png`)
        fs.readFile(filePath, function (err, data) {
            if (err) resolve(false);
            resolve(data)
        })
    })
}


export {
    uploadFileMiddleware, removeTempDir, savePicToDisk, getPicByMd5
}