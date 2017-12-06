const router = require('koa-router')();
const inspect = require('util').inspect;
const path = require('path');
const fs = require('fs');
const Busboy = require('busboy');
/**
 * 同步创建文件目录
 * @param  {string} dirname 目录绝对地址
 * @return {boolean}        创建目录结果
 */
function mkdirsSync( dirname ) {
    if (fs.existsSync( dirname )) {
        return true
    } else {
        if (mkdirsSync( path.dirname(dirname)) ) {
            fs.mkdirSync( dirname );
            return true
        }
    }
}
/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}
 */
function uploadFile( ctx, options) {
    let req = ctx.req;
    let res = ctx.res;
    let busboy = new Busboy({headers: req.headers});
    return new Promise((resolve, reject) => {
        console.log('文件上传中...');
        let result = {
            success: false,
            formData: {},
        };
        // 解析请求文件事件
        busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
            let fileType="";
            let type=mimetype.split('/');
            switch (type[0]){
                case "application":
                    fileType="files";
                    break;
                case "image":
                    fileType="images";
                    break;  
                case "text":
                    fileType="txt";  
            }
            let filePath=path.join( options.path,  fileType);
            console.log(filePath,'444444')
            let mkdirResult = mkdirsSync( filePath );
            let _uploadFilePath = path.join( filePath, filename );
            let saveTo = path.join(_uploadFilePath);
            console.log('4567',saveTo);
            // 文件保存到制定路径
            file.pipe(fs.createWriteStream(saveTo));
            // 文件写入事件结束
            file.on('end', function() {
                result.success = true;
                result.message = '文件上传成功';
                console.log('文件上传成功！')
            })
        });
        // 解析结束事件
        busboy.on('finish', function( ) {
            console.log('文件上结束');
            resolve(result)
        });
        // 解析错误事件
        busboy.on('error', function(err) {
            console.log('文件上出错');
            reject(result)
        });
        req.pipe(busboy)
    })
}
router.post('/upload',async (ctx,next)=>{
    let serverFilePath = path.join( './public', 'static' );
    console.log(serverFilePath,process.cwd());

    let result1=await uploadFile(ctx,
        {
            path: serverFilePath
        });
    ctx.body=result1;
});
module.exports = router;