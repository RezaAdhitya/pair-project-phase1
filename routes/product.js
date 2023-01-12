const express = require('express');
const multer = require('multer');
const Controller = require('../controllers/controller');
const router = express.Router();
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
router.get('/');

// add product
router.get('/add', Controller.addProductForm);
router.post('/add', upload.single('imageUrl'), (req, res) => {
    Controller.addProduct(req, res);
});

// delete product
router.get('/:productId/delete', Controller.deleteProduct);

// edit product
router.get('/:productId/edit', Controller.productEditForm);
router.post('/:productId/edit', upload.single('imageUrl'), (req, res) => {
    console.log(req.body);
    // Controller.productEdit(req, res);
});

module.exports = router;