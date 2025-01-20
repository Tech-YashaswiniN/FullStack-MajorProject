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

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q ? req.query.q.trim() : ''; 
        console.log("Search query received:", query);

        if (!query) {
            console.log("No search query provided.");
            return res.redirect('/listings');
        }

        const alllistings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        });

        console.log("Listings found:", alllistings.length);
        res.render('listings/index', { alllistings });  // Pass 'alllistings' here

    } catch (err) {
        console.error("Error during search:", err);
        res.status(500).send("Internal Server Error");
    }
});



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

// Route to render the payment page
router.get("/:id/payment", async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the listing details from the database
        const listing = await Listing.findById(id);

        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        res.render("listings/payment", {
            listing,
            phonePeQR: "/images/phonepe-qr.png", // Add your QR code paths here
            gPayQR: "/images/gpay-qr.png",
        });
    } catch (error) {
        console.error("Error loading payment page:", error.message);
        req.flash("error", "Unable to load payment page.");
        res.redirect("/listings");
    }
});


// router.get('/search', async (req, res) => {
//     const query = req.query.search; // Match the 'search' parameter name
//     try {
//         const listings = await Listing.find({
//             $or: [
//                 { name: { $regex: query, $options: 'i' } }, // Search in the name field
//                 { location: { $regex: query, $options: 'i' } } // Search in the location field
//             ]
//         });
//         res.json(listings); // Return listings as JSON
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Error fetching search results' });
//     }
// });











module.exports = router;