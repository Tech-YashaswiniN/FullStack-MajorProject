const express = require("express");
const router = express.Router();
const Listing = require("../modules/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { islLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js"); 
const upload = multer({storage});

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}


router
    .route("/")
    // Index route
    .get(wrapAsync(listingController.index))
    //create route
    .post(islLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));



//new route
router.get("/new", islLoggedIn, listingController.renderNewForm)/*Have write /new route here, router.route("/:id") will treate the /new as an id and try to search in the database but it not possible /new is not in the db 
The error is "Cast to ObjectId failed for value "new" (type string) at path "_id" for model "Listing"*/


router
    .route("/:id")
    //Show route
    .get(wrapAsync(listingController.showListing))
    //update route
    .put(islLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
    //delete route
    .delete(islLoggedIn, isOwner, wrapAsync(listingController.destroyListing))


//edit route
router.get("/:id/edit", islLoggedIn, isOwner, wrapAsync(listingController.renderEditForm))






module.exports = router;