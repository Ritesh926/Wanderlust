const express = require("express");
const router = express.Router();
const listings = require("../controllers/listings");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage: storage });


// path: routes/listing.js   "/"
router.route("/")
    .get(wrapAsync(listings.index))
    .post(isLoggedIn,
         
         upload.single('listing[image]'),
         validateListing,   
          wrapAsync(listings.createListing));
    
// path: routes/listing.js   "/new"  
router.route("/new")
    .get(isLoggedIn, listings.renderNewForm);



// path: routes/listing.js   "/:id"
router.route("/:id")
    .get(wrapAsync(listings.showListing))
    .put(isLoggedIn,
         isOwner,
         upload.single('listing[image]'),
          validateListing, 
          wrapAsync(listings.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));


// path: routes/listing.js   "/:id/edit"
router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(listings.renderEditForm));

//module imports
module.exports = router;
