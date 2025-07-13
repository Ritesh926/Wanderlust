
const Listing = require("./models/listing");
const mongoose = require("mongoose");
const ExpressError = require("./utils/ExpressError");
const { listingSchema  , reviewSchema} = require("./schema");
const Review = require("./models/review");

// middleware.js  full working
module.exports.isLoggedIn = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in!");
        return res.redirect("/login");
    }
    next();
};


// saveRedirectUrl middleware not full working

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.isAuthenticated()) {
        // If the user is authenticated, redirect to the saved URL or a default page
        const redirectUrl = req.session.redirectUrl || "/listings";
        delete req.session.redirectUrl; // Clear the redirect URL after using it
        return res.redirect(redirectUrl);
    }
    next();
};



// this isOwner middleware full working

module.exports.isOwner =  async (req, res, next) =>  {
     const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

    // Check if the current user is the owner of the listing
    if (!listing.owner._id.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};



// Validate Listing Middleware full working

module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
};

// Validate Review Middleware full working

module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    } else {
        next();
    }
}; 

// isReviewAuthor middleware
// not full working this isReviewAuthor middleware
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;

    try {
        const review = await Review.findById(reviewId)
            .populate("author")
            .populate("listing"); // 🔄 Ensure listing is defined in schema

        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect("/listings");
        }

        if (!review.author._id.equals(req.user._id)) {
            req.flash("error", "You are not the author of this review!");
            
            // ✅ Safe redirect even if listing is missing
            const listingId = review.listing?._id;
            return res.redirect(listingId ? `/listings/${listingId}` : "/listings");
        }

        next();
    } catch (err) {
        console.error("Error in isReviewAuthor middleware:", err);
        req.flash("error", "Something went wrong while checking review ownership.");
        return res.redirect("/listings");
    }
};







