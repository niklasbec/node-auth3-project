const express = require('express');
const UserRouter = require('./router-model/user-router.js');
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session);
const server = express();

server.use(express.json());
server.use(session({
    name: 'session_ID',          
    secret: 'secret',
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,         
      httpOnly: false,       
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      knex: require('./data/db-config'), 
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable: true, 
      clearInterval: 1000 * 60 * 60,
    }),
  }));
server.use('/api/users', UserRouter);

module.exports = server;
