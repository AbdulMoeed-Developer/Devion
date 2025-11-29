// const Message = require('./modals/message'); // Adjust the path as necessary

// const isMessageAuthor = async (req, res, next) => {
//     const { id } = req.params; // Extract the message ID from the request parameters
//     const message = await Message.findById(id); // Find the message by ID

//     // Check if the user is the author of the message
//     if (!message.user.equals(req.user._id)) { 
//         req.flash('error', 'You do not have permission to do that!');
//         return res.redirect('/message'); // Redirect to the messages page if not authorized
//     }

//     next(); // Call the next middleware if authorized
// };

// // Export multiple middleware functions
// module.exports = {
//     isMessageAuthor,
//     storeReturnTo: (req, res, next) => {
//         if (req.session.returnTo) {
//             res.locals.returnTo = req.session.returnTo;
//         }
//         next();
//     },
//     isLoggedIn: (req, res, next) => {
//         if (!req.isAuthenticated()) {
//             req.session.returnTo = req.originalUrl; // add this line
//             req.flash('error', 'You must be signed in first!');
//             return res.redirect('/users/loginForm');
//         }
//         next();
//     }
// };











const Message = require('./modals/message'); // Adjust the path as necessary

module.exports.isMessageAuthor = async (req, res, next) => {
    const { id } = req.params; // Extract the message ID from the request parameters
    const message = await Message.findById(id); // Find the message by ID

    // Check if the user is the author of the message
    if (!message.user.equals(req.user._id)) { 
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect('/message'); // Redirect to the messages page if not authorized
    }

    next(); // Call the next middleware if authorized
}


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/users/loginForm');
    }
    next();
}

