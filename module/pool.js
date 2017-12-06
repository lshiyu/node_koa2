const mysql=require('mysql');
const pool=mysql.createPool({
    host:'120.92.108.221',
    port:'3306',
    user:'shiyuli',
    password:'8704310',
    database:'test',
    connectionLimit:2
});
const query=function(sql,args,callback){
    pool.getConnection((err,connection)=>{
        connection.query(sql,args,(err,result)=>{
            connection.release();
            //断开数据库连接
            callback(err,result);
        })
    })
};
const p=(sql,args)=>{
    return new Promise((resolve,reject)=>{
        query(sql,args,(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        })
    })
};
exports.query=p;
