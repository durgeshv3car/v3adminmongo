const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { createPermission, getPermissions } = require('../controllers/permissionController');

const router = express.Router();

router.post('/', protect, authorize('create_permission'), createPermission);
router.get('/', protect, authorize('view_permission'), getPermissions);

module.exports = router;
