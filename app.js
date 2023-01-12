const express = require('express')
const router = require('./routes')
const app = express()
const session = require('express-session')
const port = 3000

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'hacktiv8',
  resave: false, // jika selalu save -> true; save jika ada perubahan aja -> false
  saveUninitialized: false, // jika true, ......
  cookie: { secure: false, sameSite: true } // true untuk https; untuk development env, pake false jg gpp; same site untuk defend dari csrf atk
}))

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})