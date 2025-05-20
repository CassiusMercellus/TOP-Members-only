const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false
}));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/messages', require('./routes/message'));

// Sync database and start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 