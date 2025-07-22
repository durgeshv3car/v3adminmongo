const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Role = require('../models/Role');







exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultRole = await Role.findOne({ id: role });
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || defaultRole._id,
    });



    res.status(201).json({ message: 'User created successfully' });
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role.name,  // or role._id if you just want ID
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      id: user._id,
      token,
      role: user.role,          // Full role object
      permissions: user.permissions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, permissions } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (permissions) user.permissions = permissions;

    await user.save();
  

    res.json({ success: true, user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Authorization token missing' });

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { adminId, id } = req.params;
    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "Super Admin") {
      return res.status(403).json({ message: 'Super Admin privileges required' });
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) return res.status(404).json({ message: 'User not found' });

    await userToDelete.deleteOne();
 

    res.status(200).json("User deleted successfully");
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err });
  }
};
