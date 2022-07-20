const express = require('express')
const app = express()
const cors = require('cors')
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash-plus');
const dotenv = require('dotenv').config()
const exphbs = require('express-handlebars')
require('./models')
require('./config/passport')(passport);

app.use(express.urlencoded({ extended: true })) // replaces body-parser
app.use(express.json())
app.use(cors({
	credentials: true // add Access-Control-Allow-Credentials to header
}))

// setup a session store signing the contents using the secret key
app.use(session({ secret: process.env.PASSPORT_KEY,
	resave: true,
	saveUninitialized: true
}));

//middleware that's required for passport to operate
app.use(passport.initialize());

// middleware to store user object
app.use(passport.session());

// use flash to store messages
app.use(flash());

app.use(express.static('public'))	// define where static assets live
// set the template engine to handlebars
app.engine('hbs', exphbs({
	defaultlayout: 'main',
	extname: 'hbs',
	helpers: require(__dirname + "/public/js/helpers.js").helpers
}))
app.set('view engine', 'hbs')




const port = process.env.PORT || 8080 
const vendorRouter = require('./routes/vendorRouter')
const customerRouter = require('./routes/customerRouter');

app.get('/', (req, res) => {res.redirect('/customer')})
app.use('/vendor', vendorRouter)
app.use('/customer', customerRouter);
app.all('*', (req, res) => {  // 'default' route to catch user errors
	res.status(404).render('error', {errorCode: '404', message: 'That route is invalid.'})
})

app.listen(port, () => {
  console.log(`Snacks in a Van app listening at http://localhost:${port}`)
});

module.exports = app