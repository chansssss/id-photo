import path from 'path'
import fs from 'fs';
const __dirname = path.resolve()

function uploadFileMiddleware(req) {
    return new Promise((resolve,reject) => {
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
        fs.rmdirSync(path, { recursive: true });
    }
}

export {
    uploadFileMiddleware, removeTempDir
}