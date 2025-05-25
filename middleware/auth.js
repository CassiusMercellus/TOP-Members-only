const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/login');
};

const isMember = (req, res, next) => {
  if (req.isAuthenticated() && (req.user.isMember || req.user.isAdmin)) {
    return next();
  }
  res.redirect('/');
};

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  res.redirect('/');
};

module.exports = {
  isAuthenticated,
  isMember,
  isAdmin
}; 