const Listing = require("./modules/listing.js");
const ExpressError = require("./utils/ExpressErr.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./modules/review.js");

module.exports.islLoggedIn = (req, res, next) => {
    // console.log(req.user) // it will show details of user after login
    //console.log(req.path, "..", req.originalUrl);  //if we click on Add new listing without login it will take us to login page, but still it will give the path taht is  which path we were about to go  that is this....."/relativePath .. /originalPath"   /new .. /listings/new. If we click on edit /665b2e205de3ef676f123ec0/edit .. /listings/665b2e205de3ef676f123ec0/edit
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

