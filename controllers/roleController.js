const Role = require('../models/Role');

// Create Role with permissions
exports.createRole = async (req, res) => {
    try {
        const { name } = req.body; // permissions = [permissionId1, permissionId2]

        const role = await Role.create({ name});
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all roles
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find().populate('permissions');
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, permissions } = req.body;
  
      const updatedRole = await Role.findByIdAndUpdate(
        id,
        { name, permissions },
        { new: true }
      ).populate('permissions');
  
      if (!updatedRole) {
        return res.status(404).json({ message: 'Role not found' });
      }
  
      res.json(updatedRole);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
