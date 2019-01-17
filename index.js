var express = require("express"),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require('passport-local-mongoose'),
  User = require("./models/user"),
  session = require('express-session'),
  mongoose = require('mongoose');
  
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set('trust proxy', 1) // trust first proxy
app.use(require("express-session")({
    secret: "try to decode my password if you did your are the best in world!",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


mongoose.connect('mongodb://localhost/auth_demo', { useNewUrlParser: true });

//routes
app.get("/", function(req, res) {
    res.render("home");
});

app.get("/main", isLoggedIn, function(req, res) {
    res.render("main");
});

//Auth routes
app.get("/reg", function(req, res) {
    res.render("register");
});
//sign up handling
app.post("/reg", function(req, res) {

  req.body.username
  req.body.password
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err)
          return res.render('register');
      }
      passport.authenticate("local")(req, res, function(){
         res.redirect("/main");
      });
  });
    
});

//login handle
app.get("/login", function(req, res) {
    res.render("login");
});

//login logic
app.post("/login", passport.authenticate('local',{
        successRedirect: '/main',
        failureRedirect: '/login'
    }), function(req, res){
});

//logout login
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//handle middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
     return next()
    }
    res.redirect("/login");
}


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("your app running now.....");
});