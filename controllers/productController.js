const Product = require('../models/productModel');

// Get all products


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();

        const hostUrl = `${req.protocol}://${req.get('host')}`;

        const updatedProducts = products.map(product => {
            if (product.image && !product.image.startsWith('http')) {
                // ✅ Ensure image path starts with '/'
                const imgPath = product.image.startsWith('/') ? product.image : `/${product.image}`;
                product.image = `${hostUrl}${imgPath}`;
            }
            return product;
        });

        res.json(updatedProducts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Ensure image path is converted to full URL with proper '/'
        if (product.image && !product.image.startsWith('http')) {
            const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
            product.image = `${req.protocol}://${req.get('host')}${imagePath}`;
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Create product
exports.createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: 'Product not found' });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Upload image handler
exports.uploadImage = (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
};




// Get all unique categories with product count
exports.getCategories = async (req, res) => {
    try {
        const categories = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    count: 1
                }
            },
            {
                $sort: { category: 1 } // Optional: sort alphabetically
            }
        ]);
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get products by specific category
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({ category: req.params.category });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Search products by name or description
exports.searchProducts = async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) return res.status(400).json({ message: 'Query required' });

        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });

        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};