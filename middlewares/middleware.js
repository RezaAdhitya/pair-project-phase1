let isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/login')
  } else {
    next()
  }
}

let isCustomer = (req, res, next) => {
  if (req.session.userRole === 'Customer' || req.session.userRole === 'Admin') {
    next()
  } else {
    res.redirect('/products?msg=authFail')
  }
}

let isSeller = (req, res, next) => {
  if (req.session.userRole === 'Seller' || req.session.userRole === 'Admin') {
    next()
  } else {
    res.redirect('/products')
  }
}

let isNonAdmin = (req, res, next) => {
  if (req.session.userRole === 'Seller' || req.session.userRole === 'Customer') {
    next()
  } else {
    res.redirect('/products')
  }
}

let isAdmin = (req, res, next) => {
  if (req.session.userRole === 'Admin') {
    next()
  } else {
    res.redirect('/products')
  }
}

let isCheckingAdminProfile = (req, res, next) => {
  if(req.params.id === 1 && req.session.userRole === 'Admin') {
    next()
  } else {
    res.redirect('/products')
  }
}

module.exports = { isLoggedIn, isCustomer, isSeller, isAdmin, isCheckingAdminProfile }