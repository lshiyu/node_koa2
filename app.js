const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors=require('koa2-cors');
const router = require('koa-router')();

const index = require('./routes/index');
const books = require('./routes/books');
const filesUp = require('./routes/fileUp');

// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
// app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));
app.use(async (ctx,next)=>{
  const start= new Date();
  await next();
  const ms=new Date()-start;
  console.log(`-->begin ${start}`);
  console.log(ctx.method,ctx.url,ctx.query,ctx.request.body,ctx.header.host,ctx.status,ctx.message);
  console.log(`<--end ${new Date()}`);
  console.log(`<->useTime ${ms}ms`);

});
//跨域
app.use(cors({
    allowedMethods:['GET','POST','DELETE','PUT','PATCH']
}));
// routes
router.use('/files',filesUp.routes(),filesUp.allowedMethods());
router.use('/index',index.routes(), index.allowedMethods());
router.use('/api',books.routes(), books.allowedMethods());

app.use(router.routes(),router.allowedMethods());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app;
