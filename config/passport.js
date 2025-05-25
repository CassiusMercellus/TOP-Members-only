const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Local strategy for username/password login
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isValid = await user.verifyPassword(password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

module.exports = passport; 