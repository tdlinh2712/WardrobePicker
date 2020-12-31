const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true,
        enum: [
          'Top',
          'Bottom',
          'Full body',
          'Shoes'
        ]
      },
    style: {
        type: [String],
        required: true,
        enum: [
            'Everyday',
            'Formal',
            'Party'
        ]
    },
    color: {
        type: [String],
        required: [true, 'Please add colors']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    wardrobe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Wardrobe',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    }
});

//static method to get total items of a wardrobe
ItemSchema.statics.getTotalItems = async function(wardrobeId) {
    const obj = await this.aggregate([
        {
            $match: {wardrobe: wardrobeId},
        },
        {
            $count: "totalItems"
        }
    ]);
    try {
        await this.model('Wardrobe').findByIdAndUpdate(wardrobeId, {
            totalItems: obj[0].totalItems
        })
    } catch (err) {
        console.log(err);
        
    }
};

//call getTotalItems after save
ItemSchema.post('save', function() {
    this.constructor.getTotalItems(this.wardrobe);
})

//call averageCost before remove
ItemSchema.pre('remove', function() {
    this.constructor.getTotalItems(this.wardrobe);
})

module.exports = mongoose.model('Item', ItemSchema);