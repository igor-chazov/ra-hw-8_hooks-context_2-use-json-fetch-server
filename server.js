const http = require('http');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const Router = require('koa-router');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const dirPublic = path.join(__dirname, '/public');
app.use(koaStatic(dirPublic));

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

router.get('/data', async (ctx) => {
  ctx.response.body = { status: 'ok' };
});

router.get('/error', async (ctx) => {
  ctx.response.status = 500;
  ctx.response.body = { status: 'Internal Error' };
});

router.get('/loading', async (ctx) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });
  ctx.response.body = { status: 'ok' };
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

// eslint-disable-next-line no-console
server.listen(port, () => console.log('Server started'));
