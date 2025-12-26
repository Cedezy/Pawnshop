const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db.js');
const dotenv = require("dotenv");
const cookieParser = require('cookie-parser');
const path = require("path");
const AuthRoute = require('./routes/AuthRoute.js');
const UserRoute = require('./routes/UserRoute.js');
const CustomerRoute = require('./routes/CustomerRoute.js');
const PawnRoute = require('./routes/PawnRoute.js');
const ReceiptRoute = require('./routes/ReceiptRoute.js');
const AboutUsRoute = require('./routes/AboutUsRoute.js');
const ContactUsRoute = require('./routes/ContactUsRoute.js');
const FAQsRoute = require('./routes/FAQsRoute.js');
const RateRoute = require('./routes/RateRoute.js');

dotenv.config(); 
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: "10mb" })); 
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes API
app.use('/api/auth', AuthRoute);
app.use('/api/user', UserRoute);
app.use('/api/customer', CustomerRoute);
app.use('/api/pawn', PawnRoute);
app.use('/api/receipt', ReceiptRoute);
app.use('/api/aboutUs', AboutUsRoute);
app.use('/api/contactUs', ContactUsRoute);
app.use('/api/faqs', FAQsRoute);
app.use('/api/rate', RateRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
