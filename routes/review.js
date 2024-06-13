const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../modules/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressErr.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../modules/review.js");
const { validateReview, islLoggedIn, isReviewAuthor } = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");

// Reviews
// post route
router.post("/", islLoggedIn, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId", islLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;