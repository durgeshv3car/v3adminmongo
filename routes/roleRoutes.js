const express = require('express');

const { createRole, getRoles, updateRole } = require('../controllers/roleController');
const router = express.Router();

// router.post('/', createRole);
// router.get('/', protect,  getRoles);
// router.put('/:id', protect,  updateRole);


module.exports = router;