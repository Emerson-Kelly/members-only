import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'url';
import passport from './config/passport.js';
import session from 'express-session';
import pgSession from "connect-pg-simple";
import { pool } from "./db/pool.js";
import { indexRouter } from './routes/index.js';
import { usersRouter } from './routes/signUp.js';
import { membersOnlyRouter } from './routes/membersOnly.js';
import { loginRouter } from './routes/login.js';
import { newMessageRouter } from './routes/newMessage.js';
import { adminRouter } from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PgSession = pgSession(session);

app.use(
  session({
    store: new PgSession({
        pool: pool,
        tableName: "session",
        createTableIfMissing: true,
    }),
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', membersOnlyRouter);
app.use('/', loginRouter);
app.use('/', newMessageRouter);
app.use('/', adminRouter);

app.use((req, res, next) => {
    res.status(404).render("pages/404");
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
