/*
This file is based on the example passport.js file provided by the University of Melbourne INFO30005 staff
*/

// used to create our local strategy for authenticating
// using username and password
const LocalStrategy = require('passport-local').Strategy;

// our user model
const User = require('../models/user');
const Van = require('../models/van')


module.exports = function(passport) {

    // these two functions are used by passport to store information
    // in and retrieve data from sessions. We are using user's object id
    passport.serializeUser(function(user, done) {

        done(null, { _id: user.id, role: user.role });

    });

   
    passport.deserializeUser((login, done) => {
        if (login.role === 'customer') {
            User.findById(login, function (err, user) {
                if (user)
                    done(null, user);
                else
                    done(err, { message: 'User not found' })
            });
        }
        else if (login.role === 'van') {
            Van.findById(login, (err, van) => {
                if (van)
                    done(null, van);
                else
                    done(err, { message: 'Admin not found' })
            });
        }
        else {
            done({ message: 'No entity found' }, null);
        }
    });


    

    // Use two LocalStrategies, one for customer and the other for vendor
    // strategy to login - customer
    passport.use('local-login', new LocalStrategy({
            usernameField : 'email', 
            passwordField : 'password',
            passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, email, password, done) {

            process.nextTick(function() {
                // see if the user with the email exists
                User.findOne({ 'email' :  email }, function(err, user) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'Account not found, please signup first'));

                    if (!user.validPassword(password)){
                        // false in done() indicates to the strategy that authentication has
                        // failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the user's email in the session
                    else {
                        req.session.email=email       
                        // done() is used by the strategy to set the authentication status with details of the user who was authenticated
                        return done(null, user, null);
                    }
                });
            });

        }));


    // strategy to login - vendor
    passport.use('vendor-local-login', new LocalStrategy({
        // vendor login uses vanname
        usernameField : 'name', 
        passwordField : 'password',
        passReqToCallback : true}, // pass the req as the first arg to the callback for verification 
        function(req, name, password, done) {

            process.nextTick(function() {
                // see if the user with the van exists
                Van.findOne({ 'name' :  name }, function(err, van) {
                    // if there are errors, user is not found or password
                    // does match, send back errors
                    if (err)
                        return done(err);
                    if (!van)
                        return done(null, false, req.flash('loginMessage', 'Account not found'));

                    if (!van.validPassword(password)){
                        // false in done() indicates to the strategy that authentication has failed
                        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                    }
                    // otherwise, we put the van's name in the session      
                    else {     
                        req.session.name = name       
                        // done() is used by the strategy to set the authentication status with details of the user who was authenticated
                        return done(null, van, null);
                    }
                });
            });

        }));



    // for customer signup
    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true }, // pass the req as the first arg to the callback for verification 
            
        function(req, email, password, done) {         
            process.nextTick( function() {
                User.findOne({'email': email}, function(err, existingUser) {
                    // search a user by the username (email in our case)
                    // if user is not found or exists, exit with false indicating authentication failure
                    if (err) {
                        console.log(err);
                        return done(err);
                    }
                    if (existingUser) {
                        console.log("existing");
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    }
                    else {
                        // create a new user
                        var newUser = new User();
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.firstname = req.body.firstname;
                        newUser.lastname = req.body.lastname;

                        // and save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser, null);
                        });
                        req.session.email=email
                    }
                });
            });
        }));

};