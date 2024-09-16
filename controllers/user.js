const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");

module.exports.signUp =  (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.userPost = async(req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next;
            }
            req.flash("success", "Welcome to WanderLust!!");
            res.redirect("/listings");
        });
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}

module.exports.userLogin = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.userAuthentication = async(req,res) => {
    req.flash("success", "Welcome back to WanderLust!");
    if (res.locals.saveRedirectUrl){
        res.redirect(res.locals.saveRedirectUrl);
    }else{
        res.redirect("/listings");
    }
}

module.exports.userLogout =  (req, res, next)=> {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "you are logged out!");
        res.redirect("/listings");
    })
}
