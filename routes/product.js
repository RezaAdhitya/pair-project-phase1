const express = require('express');
const multer = require('multer');
const Controller = require('../controllers/controller');
const router = express.Router();
const { isLoggedIn, isCustomer, isSeller, isAdmin } = require('../middlewares/middleware');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        let currentTime = new Date().getTime();
        cb(null, `${file.fieldname}-${currentTime}.png`)
    }
});
const upload = multer({storage: storage});

// product list
router.get('/', Controller.listAllProducts);

// add product
router.get('/add', isSeller, Controller.addProductForm);
router.post('/add', upload.single('imageUrl'), (req, res) => {
    Controller.addProduct(req, res);
});

// product detail
router.get('/:productId', Controller.productDetail)

// delete product
router.get('/:productId/delete', isSeller, Controller.deleteProduct);

// edit product
router.get('/:productId/edit', isSeller, Controller.productEditForm);

router.post('/:productId/edit', upload.single('imageUrlEdit'), (req, res) => {
    Controller.productEdit(req, res);
});

module.exports = router;