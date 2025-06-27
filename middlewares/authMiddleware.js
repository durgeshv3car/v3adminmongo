// const jwt = require('jsonwebtoken');
// const User = require('../models/User');
// const Role = require('../models/Role');

// const protect = async (req, res, next) => {
//     let token = req.headers.authorization;

//     if (token && token.startsWith('Bearer')) {
//         token = token.split(' ')[1];
//         try {
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             req.user = await User.findById(decoded._id).populate('role');
//             next();
//         } catch (error) {
//             return res.status(401).json({ message: 'Not authorized, token failed' });
//         }
//     } else {
//         return res.status(401).json({ message: 'No token, authorization denied' });
//     }
// };

// const authorize = (permissionName) => {
//     return async (req, res, next) => {
//         const userRole = await Role.findById(req.user.role._id).populate('permissions');

//         const hasPermission = userRole.permissions.some(
//             (perm) => perm.name === permissionName
//         );

//         if (!hasPermission) {
//             return res.status(403).json({ message: 'Access Denied' });
//         }
//         next();
//     };
// };

// module.exports = { protect, authorize };



const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

// Protect Middleware (Token Verification)
const protect = async (req, res, next) => {
    let token = req.headers.authorization;

    if (token && token.startsWith('Bearer')) {
        token = token.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).populate('role');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.role) {
                return res.status(403).json({ message: 'User has no role assigned. Please contact admin.' });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Token verification failed' });
        }
    } else {
        return res.status(401).json({ message: 'No token provided' });
    }
};

// Authorize Middleware (Permission Check)
const authorize = (permissionName) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Access Denied: Role missing' });
        }

        const userRole = await Role.findById(req.user.role._id).populate('permissions');
        if (!userRole) {
            return res.status(403).json({ message: 'Role not found' });
        }

        const hasPermission = userRole.permissions.some(
            (perm) => perm.name === permissionName
        );

        if (!hasPermission) {
            return res.status(403).json({ message: 'Access Denied: Permission missing' });
        }

        next();
    };
};

module.exports = { protect, authorize };
