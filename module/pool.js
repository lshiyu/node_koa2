const mysql=require('mysql');
const pool=mysql.createPool({
    host:'*********',
    port:'3306',
    user:'********',
    password:'******',
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
