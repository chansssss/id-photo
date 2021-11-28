### props
|prop|是否必须|默认值|说明|
|---|---|---|---|
|picObj|是|无|待裁切的图片对象，可以是url blob base64|
|outputWidth|否|750|输出图片的宽度（像素）|
|outputType|否|base64|输出图片的类型 base64 file url|
|fixedNumber|否|[9,16]|裁切框的比例|

### 回调函数
> getCutPic(resp)    
返回裁切的图片对象，类型由outputType控制

### 示例
```
<aoe-cut-pic ref="cutPicRef" outputType="base64" :picObj="url" @getCutPic="getCutPic"></aoe-cut-pic>
```