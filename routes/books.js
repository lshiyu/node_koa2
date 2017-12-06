const router = require('koa-router')();
const pool=require('../module/pool');
//查询所有
router.get('/books',async (ctx,next)=>{
  // let params=ctx.query;
  ctx.body= {success:true, data: await pool.query('select * from book_list order by user_id',[])}
});
//添加新数据
router.post('/addBooks',async (ctx,next)=>{
  let params=ctx.request.body;
  if(params){
    ctx.body= {success:true ,data:await pool.query('insert into book_list(book_name,book_author,book_info,price,create_time) values(?,?,?,?,?)',[params.bookname, params.author,params.bookinfo,params.price, new Date()])};
  }
});
//搜索
router.post('/search',async (ctx,next)=>{
  let params=ctx.request.body;
  console.log(params);
    ctx.body={success:true,data:await pool.query('select * from book_list where book_author like ? or book_name like ? or book_info like ?',[`%${params.val}%`,`%${params.val}%`,`%${params.val}%`])}
});
//更新
router.post('/update',async(ctx,next)=>{
  let params=ctx.request.body;
  if(params.author&&params.bookname&&params.id){
    ctx.body={success:true,data:await pool.query('update book_list set book_author=?,book_name=? where user_id=?',[params.author,params.bookname,params.id])}
  }else if(!params.author){
    ctx.body={success:false,message:'author is required'}
  }else if(!params.bookname){
    ctx.body={success:false,message:'title is required'}
  }
});
//批量删除
router.post('/deleteAll/:ids',async(ctx,next)=>{
  let params=ctx.params;
  console.log('--------------',params);
  if(params.ids){
      id=params.ids.split(',');
      console.log('---------->',id);
      ctx.body={success:true,data:await pool.query('delete from book_list where user_id in(?)',[id])}
  }else{
    ctx.body={success:false,message:'user_id is required'}
  }
});

module.exports = router;
