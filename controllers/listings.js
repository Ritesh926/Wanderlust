const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }

      // ✅ Add this check here before rendering the page
  if (!listing.latitude || !listing.longitude) {
    listing.latitude = 30.7046; // Chandigarh default
    listing.longitude = 76.7179;
  }

    res.render("listings/show.ejs", { listing, currUser: req.user });
};

module.exports.createListing = async (req, res) => {
    let Url = req.file.path;
    let filename = req.file.filename;
   
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url: Url, filename: filename };
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
 // Prepare the original image URL for display editing
    let originalImage = listing.image.url;
    let originalImageUrl = originalImage.replace("uploads", "/uploads/h_300,w_250");
// form rendering
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });

   if (typeof req.file !== "undefined") {
        let Url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url: Url, filename: filename };
    await listing.save();
    }


    req.flash("success", "Successfully updated the listing!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing!");
    res.redirect("/listings");
};
