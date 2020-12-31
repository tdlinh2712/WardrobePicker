const mongoose = require('mongoose');
const slugify = require('slugify');

const WardrobeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please add a name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters']
    },
    totalItems: {
      type: Number
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//create wardrobe slug from the name
WardrobeSchema.pre('save', function(next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

//cascade delete items when a wardrobe is deleted
WardrobeSchema.pre('remove', async function(next) {
    console.log(`Items being removed from wardrobe ${this._id}`);
    
    await this.model('Item').deleteMany({ wardrobe: this._id });
    next();
});

//reverse populate with virtuals
WardrobeSchema.virtual('items', { 
    ref: 'Item',
    localField: '_id',
    foreignField: 'wardrobe',
    justOne: false
 });

module.exports = mongoose.model('Wardrobe', WardrobeSchema);