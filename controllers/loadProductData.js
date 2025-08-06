const fs = require('fs');
const path = require('path');
const Product = require('../models/productModel');
const products = require('../data/products');

const sanitizeFileName = (name) => {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

const loadProductData = async (req, res) => {

    // console.log("products",products);
    try {
        const uploadDir = path.join(__dirname, '..', 'uploads');

        // Get list of all image files in /uploads
        let imageFiles = fs.readdirSync(uploadDir)
            .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
            .sort(); // Ensure a predictable order
console.log("imageFiles.length",imageFiles.length);
console.log("products.length",products.length);

        if (imageFiles.length < products.length) {
            return res.status(400).json({ message: 'Not enough images in the uploads folder' });
        }

        for (let i = 0; i < products.length; i++) {
        console.log("value",i);
            const product = products[i];
            const imageFile = imageFiles[i]; // e.g., 'abc.jpg'
            const imageExt = path.extname(imageFile); // e.g., '.jpg'

            const sanitizedName = sanitizeFileName(product.name);
            const newImageName = `${sanitizedName}${imageExt}`;
            const newImagePath = path.join(uploadDir, newImageName);

            // Rename the image file
            const oldImagePath = path.join(uploadDir, imageFile);
            if (!fs.existsSync(newImagePath)) {
                fs.renameSync(oldImagePath, newImagePath);
                console.log(`Renamed ${imageFile} → ${newImageName}`);
            }

            // Set the image field in the product
            product.image = `${newImageName}`;

            // Save the product
            const newProduct = new Product(product);
            await newProduct.save();
            console.log("data",i)
        }
console.log("Products and images loaded and renamed successfully");
        res.status(200).json({ message: 'Products and images loaded and renamed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error loading product data', error: error.message });
    }
};

module.exports = { loadProductData };
