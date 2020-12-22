const express = require('express');
const { 
    getItems, 
    getItem, 
    createItem, 
    updateItem, 
    deleteItem,
    itemPhotoUpload
} = require('../controllers/items');

const Item = require('../models/Item');
//const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router.route('/')
    .get(getItems)
    .post(createItem);

router.route('/:id')
    .get(getItem)
    .put(updateItem)
    .delete(deleteItem);
    
router.route('/:id/photo')
    .put(itemPhotoUpload);
module.exports = router;