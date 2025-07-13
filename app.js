if (process.env.NODE_ENV !== "production") {
  require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); // Assuming you have a User model defined


const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user"); // Assuming you have user routes defined




const dbUrl = process.env.ATLASDB;

// Connect to MongoDB
main()
  .then(() => console.log("✅ connected to DB"))
  .catch((err) => console.log("❌ DB error:", err));


async function main() {
  await mongoose.connect(dbUrl);
}

// Middleware setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));



// Use MongoStore to store session data in MongoDB

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time period in seconds after which the session will be updated
});

store.on("error", () =>{
  console.log("❌ Session store error" , err);
});

// Session configuration
const sessionOptions = {
  //atlas user
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    httpOnly: true, // Helps prevent XSS attacks
  },
 
};






// use flash to store messages in session 
// use flash in before routes
app.use(session(sessionOptions));
app.use(flash());


// Passport configuration  
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// Middleware to make flash messages available in views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  
  next();
});

// Use Routes
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);


// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("Error.ejs", { message });
});

app.listen(8080, () => {
  console.log("✅ Server is listening on port 8080");
});
