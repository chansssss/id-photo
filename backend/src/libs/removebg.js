import config from '../config/index.js'
import axios from 'axios';
import FormData from 'form-data'
import path from 'path'
import fs from 'fs';

let keysConfig = []
/**
 * 初始化 kaleido 配置
 *
 */
async function initConfig() {
    let keys = config.get('kaleido.keys')
    for (let index = 0; index < keys.length; index++) {
        let free_calls = await getFreeCalls(keys[index].api_key)
        if (free_calls <= 0) {
            keys[index].available = false
        }
        keys[index].free_calls = free_calls
    }
    keysConfig = keys
    config.set('kaleido.keys', keysConfig)
    console.log(keysConfig);
}

/**
 * 调用kaleido api去除图片背景
 *
 * @param {*} inputPath
 * @return {*} 
 */
async function imgRemoveBg(inputPath) {
    return new Promise(async (resolve, reject) => {
        let apiKey = getApiKey()
        if (!apiKey) {
            reject({
                code: 10001,
                msg: '接口调用次数已达到上限',
            })
        }
        console.log(apiKey);
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
                'X-Api-Key': apiKey,
            },
            encoding: null
        }).catch(function (error) {
            console.log(error);
            reject(
                {
                    code: 10002,
                    msg: '图片背景去除失败',
                }
            )
        })
        updateFreeCallsByApiKey(apiKey)
        resolve(response.data)
    })
}
/**
 * 获取可以使用的key
 *
 * @return {*} 
 */
function getApiKey() {
    for (let index = 0; index < keysConfig.length; index++) {
        const item = keysConfig[index];
        if (item.available) {
            return item.api_key
        }
    }
    return null
}


/**
 * 更新key的额度
 *
 * @return {*} 
 */
function updateFreeCallsByApiKey(apiKey, num = -1) {
    for (let index = 0; index < keysConfig.length; index++) {
        const item = keysConfig[index];
        if (item.api_key === apiKey) {
            let free_calls = keysConfig[index].free_calls + num
            keysConfig[index].available = free_calls > 0
            keysConfig[index].free_calls = free_calls
        }
    }
    config.set('kaleido.keys', keysConfig)
}


/**
 * 获取剩余调取次数
 *
 * @param {*} apiKey
 * @return {*} 
 */
async function getFreeCalls(apiKey) {
    let response = await axios({
        method: 'get',
        url: 'https://api.remove.bg/v1.0/account',
        responseType: 'application/json',
        headers: {
            'X-Api-Key': apiKey,
        },
        encoding: null
    })
    if (response.data) {
        console.log(response.data.data.attributes.api.free_calls);
        return response.data.data.attributes.api.free_calls
    }
    return 0
}

initConfig()


export {
    imgRemoveBg
}