const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const path = require('path');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

//public index.html file For React Server
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
