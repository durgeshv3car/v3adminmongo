const express = require('express');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { createRole, getRoles, updateRole } = require('../controllers/roleController');
const router = express.Router();

router.post('/', createRole);
router.get('/', protect, authorize('sub-superadmin'), getRoles);
router.put('/:id', protect, authorize('create_role'), updateRole);


module.exports = router;