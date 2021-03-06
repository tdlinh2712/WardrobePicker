const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

//@description: register user
//@route GET/api/v1/auth/register
//@access Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;
    //create user
    const user = await User.create({
        name,
        email,
        password
    });

    if (!user) {
        return next( new ErrorResponse(`User registration failed`, 400) );
    }
    sendTokenResponse(user, 200, res);
});

//@description: register user
//@route POST/api/v1/auth/login
//@access Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    //validate email and password
    if (!email || !password) {
        return next( new ErrorResponse(`Please provide email and password`), 400 );
    };

    //check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next( new ErrorResponse(`Invalid credentials`, 401));
    };
    
    //check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
        return next( new ErrorResponse(`Invalid credentials`, 401));
    };

    sendTokenResponse(user, 200, res);
});

//get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    //create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,

    };
    if(process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ 
            success: true,
            token
        });
};

//@description: get current logged in user
//@route POST/api/v1/auth/me
//@access Public
exports.getMe = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});
