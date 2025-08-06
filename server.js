const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ✅ Import cors
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

dotenv.config();
connectDB();

// 

const app = express();

// ✅ Enable CORS for all origins
app.use(cors());

// Middleware
app.use(express.json());

// Serve static React files (optional if hosting separately)
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", function(req, res) {
    res.status(200).sendFile(path.join(__dirname, "public", "index.html"));
});


// Routes
app.use('/api/products', productRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
