const router = require('koa-router');
const passport = require('koa-passport');
const userCtrl = require('../controllers/user.controller');

const userRouter = router();
module.exports = userRouter;

userRouter.use(passport.authenticate('jwt', { session: false }))

userRouter.route({
    method: 'post',
    path: '/',
    handler: async (ctx) => {
      await insert(ctx);
    }
  }
);


async function insert(ctx) {
  let user = await userCtrl.insert(ctx.request.body);
  ctx.response.body = { user };
}
