const Router = require('koa-router');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

const indexRouter = new Router();

/** GET /health-check - Check service health */
indexRouter.get('/api/health-check', (req, res) =>
  res.send('OK')
);

indexRouter.use('/api/auth', authRoutes.routes());
indexRouter.use('/api/user', userRoutes.routes());

module.exports = indexRouter;
