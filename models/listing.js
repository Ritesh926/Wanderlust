const mongoose = require("mongoose");
const Review = require("./review.js"); // Import the Review model  
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,


  reviews : [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

    owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    
    },



    // backend devlop after that try
//    category: {
//   type: String,
//   enum: [
//     "Trending",
//     "Rooms",
//     "Iconic Cities",
//     "Mountains",
//     "Castles",
//     "Camping",
//     "Farms",
//     "Arctic"
//   ],
//   required: true
// }


});


listingSchema.pre("findOneAndDelete", async function(next) {
  const listing = await this.model.findOne(this.getFilter());
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
  next();
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
