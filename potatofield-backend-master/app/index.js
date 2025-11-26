const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const multer = require('@koa/multer');
const cors = require('@koa/cors');

const routes = require('./routes');
const authorize = require('./middlewares/authorize');
const loadDatebase = require('./middlewares/load_database');
const loadRedis = require('./middlewares/load_redis');
const veryfyParams = require('./middlewares/verify_params');
const normalizeFiles = require('./middlewares/normalize_files');

const dbConfig = require('./config/database');
const redisConfig = require('./config/redis');
const jwtSecret = require('./config/jwt_secret');

const app = new Koa();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB
    fieldSize: 2 * 1024 * 1024 * 1024, // 2GB
  },
  preservePath: true,
});

app.use(cors());
app.use(veryfyParams());
app.use(loadDatebase(dbConfig));
app.use(loadRedis(redisConfig));
app.use(bodyParser({
  formLimit: '2gb',
  jsonLimit: '2gb',
  textLimit: '2gb',
}));
// Multer middleware for handling file uploads
app.use(upload.any());
// Normalize file structure to match old koa-body format
app.use(normalizeFiles());
app.use(
  routes({
    authorize: authorize(jwtSecret),
  }),
);
app.proxy = true;

const server = app.listen(3000);
server.timeout = 1000 * 60 * 10;
