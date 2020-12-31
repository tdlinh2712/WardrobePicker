const express = require('express');
const { 
    getItems, 
    getItem, 
    createItem, 
    updateItem, 
    deleteItem,
    itemPhotoUpload
} = require('../controllers/items');
const { protect } = require('../middleware/auth');

const Item = require('../models/Item');
//const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getItems)
    .post(protect, createItem);

router.route('/:id')
    .get(getItem)
    .put(protect, updateItem)
    .delete(protect, deleteItem);
    
router.route('/:id/photo')
    .put(itemPhotoUpload);
module.exports = router;