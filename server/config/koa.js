const path = require('path');
const Koa = require('koa');
const send = require('koa-send');
const serve = require('koa-static');
const httpError = require('http-errors');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
//const cookieParser = require('cookie-parser');
const compress = require('koa-compress');
const methodOverride = require('koa-methodoverride');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const koaSwagger = require('koa2-swagger-ui');
const swaggerDocument = require('./swagger.json');
const routes = require('../routes/index.route');
const config = require('./config');
const passport = require('./passport')

const app = new Koa();

if (config.env === 'development') {
  app.use(logger('dev'));
}

// Choose what fronten framework to serve the dist from
var distDir = '../../dist/';
if (config.frontend == 'react'){
  distDir ='../../node_modules/material-dashboard-react/dist'
 }else{
  distDir ='../../dist/' ;
 }

// with koa, error handling is one of the first middleware
// in express it is one of the last
// https://github.com/koajs/koa/wiki/Error-Handling
app.use( async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});
// TODO centralized error handling
//app.on('error', (err, ctx) => {});


app.use(serve(path.join(__dirname, distDir)))


console.log(distDir);
// React server
// TODO react
//app.use(serve(path.join(__dirname, '../../node_modules/material-dashboard-react/dist')))
//app.use(/^((?!(api)).)*/, (req, res) => {
//res.sendFile(path.join(__dirname, '../../dist/index.html'));
//});


app.use(bodyParser({
  detectJSON: function (ctx) {
    return /\.json$/i.test(ctx.path);
  },
}));

//app.use(cookieParser());
app.use(compress());
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(passport.initialize());

// koa2-swagger-ui does not support local swagger.json
// so I am serving it from github for simplicity
app.use(
  koaSwagger({
    routePrefix: '/api-docs',
    swaggerOptions: {
      url: 'https://raw.githubusercontent.com/zacharystenger/mean-koa/master/server/config/swagger.json'
    }
  })
);
// API router
app.use(routes.routes());

app.use( async (ctx) => {
  if(!(/^((?!(api)).)*$/.test(ctx.path))) {
    return;
  }
  await send(ctx, 'dist/index.html');
});

// catch 404 and forward to error handler
app.use((ctx, next) => {
  const err = new httpError(404)
  return next(err);
});

// error handler, send stacktrace only during development
// TODO Joi validation
/*app.use((err, req, res, next) => {

  // customize Joi validation errors
  if (err.isJoi) {
    err.message = err.details.map(e => e.message).join("; ");
    err.status = 400;
  }

  res.status(err.status || 500).json({
    message: err.message
  });
  next(err);
});*/

module.exports = app;
