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


// Load Data
const { loadProductData } = require('../controllers/loadProductData');
router.get('/loadData', loadProductData);



// Image upload route
router.post('/upload', upload.single('image'), uploadImage);

router.get('/categories', getCategories);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);


// CRUD routes
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);




module.exports = router;
