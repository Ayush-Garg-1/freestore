const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImage,
    getCategories,
    getProductsByCategory,
    searchProducts,
} = require('../controllers/productController');

// Load Data (Optional)
// const { loadProductData } = require('../controllers/loadProductData');
// router.get('/loadData', loadProductData);

// CRUD routes
router.get('/category', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);

router.get('/', getProducts);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

router.get('/:id', getProductById);

// Image upload route
router.post('/upload', upload.single('image'), uploadImage);

module.exports = router;
