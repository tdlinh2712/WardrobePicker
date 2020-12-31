const path = require('path');
const Item = require('../models/Item');
const Wardrobe = require('../models/Wardrobe');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
//@description: get items
//@route GET/api/v1/items 
//@route GET/api/v1/wardrobes/:wardrobeId/items 
//@access Public
exports.getItems = asyncHandler(async (req, res, next) => {
    if (req.params.wardrobeId) {
        const items = await Item.find({ wardrobe: req.params.wardrobeId });

        return res.status(200).json({
            success: true,
            count: items.length,
            data: items
        })

    } else {
        const items = await Item.find().populate({
            path: 'wardrobe',
            select: 'name'
        });

        res.status(200).json({ 
            success: true, 
            count: items.length,
            data: items,
        });
    }
    
});

//@description: get a single item
//@route GET/api/v1/items/:id
//@access Public
exports.getItem = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id).populate({
        path: 'wardrobe',
        select: 'name'
    });

    if (!item) {
        return next( new ErrorResponse(`No item with the id of ${req.params.id}`, 404) );
    }
    res.status(200).json({
        success: true,
        data: item
    })
});

//@description: add a item
//@route POST/api/v1/wardrobes/:wardrobeId/items/
//@access Private
exports.createItem = asyncHandler(async (req, res, next) => {
    req.body.wardrobe = req.params.wardrobeId;
    req.body.user = req.user.id;

    const wardrobe = await Wardrobe.findById(req.params.wardrobeId);

    if (!wardrobe) {
        return next( new ErrorResponse(`No wardrobe with the id of ${req.params.wardrobeId}`, 404) );
    };

    if (wardrobe.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User id is not authorized to create this item', 401))
    }
    
    const item = await Item.create(req.body);

    res.status(200).json({
        success: true,
        data: item
    })
});

//@description: update item
//@route PUT/api/v1/items/:id
//@access Private
exports.updateItem = asyncHandler(async (req, res, next) => {

    let item = await Item.findById(req.params.id);

    if (!item) {
        return next( new ErrorResponse(`No item with the id of ${req.params.wardrobeId}`, 404) );
    };
    if (item.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User id is not authorized to update this item', 401))
    }
    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //so that the returned data is updated data
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: item
    })
});

//@description: delete item
//@route DELETE/api/v1/items/:id
//@access Private
exports.deleteItem = asyncHandler(async (req, res, next) => {

    const item = await Item.findById(req.params.id);

    if (!item) {
        return next( new ErrorResponse(`No item with the id of ${req.params.wardrobeId}`, 404) );
    };
    if (item.user.toString() !== req.user.id) {
        return next(new ErrorResponse('User id is not authorized to update this item', 401))
    }
    await item.remove();

    res.status(200).json({
        success: true,
        data: {}
    })
});

//@description: upload photo item
//@route PUT/api/v1/items/:id/photo
//@access Private
exports.itemPhotoUpload = asyncHandler(async (req, res, next) => {
    const item = await Item.findById(req.params.id, req.body);

    if (!item) {
        return next(new ErrorResponse(`item not found with id of ${req.params.id}`, 404));
    }

    if(!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const {file} = req.files;
    //make sure that the image is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    //check file size
    if(file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }

    //create custom file name
    file.name = `photo_${item._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        if (err) {
            console.log(err);
            return next(
                new ErrorResponse(`Problem with the file upload`, 500));
        }

        await Item.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({
            success: true,
            data: file.name
        })
    })
})