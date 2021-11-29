import Configstore from 'configstore';

const defaultConfig = {
    kaleido: {
        keys: [
            {
                name: 'key1',
                api_key: '83PUtx7RiJzqqZhwDv3973vG',
                free_calls: 50,
                available: true
            }
        ]
    },
    fileupload: { uriDecodeFileNames: true, limits: { fileSize: 50 * 1024 * 1024 } }
}
const config = new Configstore('id-photo', defaultConfig);

export default config