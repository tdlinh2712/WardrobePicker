const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

//load env variables
dotenv.config({ path: './config/config.env' });

//load models
const Wardrobe = require('./models/Wardrobe');
const Item = require('./models/Item');
const User = require('./models/User');
//connect to DB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

//read json files
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'));
const wardrobes = JSON.parse(fs.readFileSync(`${__dirname}/_data/wardrobes.json`, 'utf-8'));
const items = JSON.parse(fs.readFileSync(`${__dirname}/_data/items.json`, 'utf-8'));
//import into DB
const importData = async () => {
    try {
        await User.create(users);
        await Wardrobe.create(wardrobes);
        await Item.create(items);
        console.log("data imported...".green.inverse);
        process.exit();
    }
    catch(err) {
        console.log(err);
    }
}

//delete data
const deleteData = async () => {
    try {
        await Wardrobe.deleteMany();
        await Item.deleteMany();
        await User.deleteMany();
        console.log("data deleted...".red.inverse);
        process.exit();
    }
    catch(err) {
        console.log(err);
    }
}

if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
}