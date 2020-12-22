const Wardrobe = require('../models/Wardrobe');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@description: get all wardrobes
//@route GET/api/v1/wardrobes
//@access Public
exports.getWardrobes = asyncHandler(async (req, res, next) => {
    const wardrobes = await Wardrobe.find().populate('items');

    res.status(200).json({ 
        success: true, 
        count: wardrobes.length,
        data: wardrobes,
    });
});

//@description: get a single wardrobe
//@route GET/api/v1/wardrobes/:id
//@access Public
exports.getWardrobe = asyncHandler(async (req, res, next) => {
    const wardrobe = await Wardrobe.findById(req.params.id);

    //if cannot find wardrobe by id
    if(!wardrobe) {
        return next(new ErrorResponse(`Wardrobe not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ 
        success: true, 
        data: wardrobe
    });
});

//@description: create new wardrobe
//@route POST/api/v1/wardrobes/
//@access Private
exports.createWardrobe = asyncHandler(async (req, res, next) => {
    const wardrobe = await Wardrobe.create(req.body);

    res.status(201).json({
        success: true,
        data: wardrobe
    })
})

//@description: update wardrobe
//@route PUT/api/v1/wardrobes/:id
//@access Private
exports.updateWardrobe = asyncHandler(async (req, res, next) => {
    const wardrobe = await Wardrobe.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //so that the returned data is updated data
        runValidators: true
    });
    if (!wardrobe) {
        return next(new ErrorResponse(`Wardrobe not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: wardrobe });  
})

//@description: delete wardrobe
//@route DELETE/api/v1/wardrobes/:id
//@access Private
exports.deleteWardrobe = asyncHandler(async (req, res, next) => {
    const wardrobe = await Wardrobe.findById(req.params.id, req.body);
    if (!wardrobe) {
        return next(new ErrorResponse(`Wardrobe not found with id of ${req.params.id}`, 404));
    }

    wardrobe.remove();

    res.status(200).json({ success: true, data: {} });
});