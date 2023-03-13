const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const registerValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const loginValidator = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});


module.exports = {
    register: async (req, res) => {
        try {
            const { error } = registerValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { email, password } = req.body;
            // Check if user already exists
            const user = await User.findOne({ email }, { maxTimeMS: 30000 });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create a new user
            const newUser = new User({ email, password: hashedPassword });
            await newUser.save();

            res.status(201).json({ message: 'User created' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { error } = loginValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Authentication failed' });
            }

            // Generate JWT token
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

            res.json({ token });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}