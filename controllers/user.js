const User = require("../modules/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("Users/signup.ejs")
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcom to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("Users/login.ejs")
}

module.exports.Login = async (req, res) => {
    // res.send("Welcome to Wanderlust! You are logged in");
    req.flash("success", "Welcome back to Wanderlust!");
    // res.redirect("/listings");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.renderLogoutForm = (req, res) => {
    req.logout((error) => { //callback as a parameter
        if (error) {
            return next(error);
        }
        else {
            req.flash("success", "You are logged out now");
            res.redirect("/listings");
        }
    })
}

