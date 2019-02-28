const Router = require('koa-router');
const passport = require('koa-passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');

const authRouter = new Router();
module.exports = authRouter;

authRouter.post(
  '/register',
  async (ctx, next) => {
    await register(ctx, next);
  },
  (ctx) => {
    login(ctx);
  }
);
authRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  (ctx) => {
    login(ctx);
  }
);
authRouter.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  (ctx) => {
    login(ctx);
  }
);

// ctx.req is Node's req object
// ctx.request is Koa's Request object
async function register(ctx, next) {
  let user = await userCtrl.insert(ctx.request.body);
  user = user.toObject();
  delete user.hashedPassword;
  ctx.req.user = user;
  next()
}

function login(ctx) {
  let user = ctx.req.user;
  let token = authCtrl.generateToken(user);
  ctx.response.body = { user, token };
}
