// koa default settings
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');

// Socket IO
const IO = require('koa-socket');
var iot = new IO('iot');
iot.attach(app);
iot.on('connection', ctx => {
  console.log(`Joining iot namespace ${ctx.socket.id}`);
});
global.iot = iot;

// koa config
const CONFIG = require('config');

// mongoose
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(CONFIG.mongo);

// routes files
const index = require('./routes/index');
const bugZapper = require('./routes/bugZapper');

// middlewares
app.use(bodyparser());
app.use(convert(json()));
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));
app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/', index.routes(), index.allowedMethods());
router.use('/bugZapper', bugZapper.routes(), bugZapper.allowedMethods());

app.use(router.routes(), router.allowedMethods());

app.on('error', function(err, ctx){
  console.log(err)
  logger.error('server error', err, ctx);
});

module.exports = app;
