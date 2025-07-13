const express = require("express");
const router = express.Router({ mergeParams: true });

const { isLoggedIn, isReviewAuthor, validateReview } = require("../middleware");
const wrapAsync = require("../utils/wrapAsync");

const reviews = require("../controllers/reviews");

// Create Review
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviews.createReview)
);

// Delete Review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
