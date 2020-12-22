const express = require('express');
const { 
    getWardrobe, 
    getWardrobes, 
    createWardrobe, 
    updateWardrobe, 
    deleteWardrobe
} = require('../controllers/wardrobes');

const Wardrobe = require('../models/Wardrobe');
const advancedResults = require('../middleware/advancedResults');

//includes other resource routers
const itemRouter = require('./items');

const router = express.Router();

//re-route into other resource routers
router.use('/:wardrobeId/items', itemRouter);

router
    .route('/')
    .get(advancedResults(Wardrobe, 'items'), getWardrobes)
    .post(createWardrobe);

router
    .route('/:id')
    .get(getWardrobe)
    .put(updateWardrobe)
    .delete(deleteWardrobe);

module.exports = router;