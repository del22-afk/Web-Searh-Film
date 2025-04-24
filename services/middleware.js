function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    else return res.redirect('/login');
  }
  
  function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
      return next();
    }
    return res.status(403).send('Akses ditolak. Hanya admin yang bisa masuk.');
  }
  
  module.exports = {
    isAuthenticated,
    isAdmin
  };
  