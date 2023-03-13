const Joi = require('joi');
const Post = require('../models/post.model');

const createPostValidator = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    location: Joi.object({
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
    }).required()
});

const updatePostValidator = Joi.object({
    title: Joi.string().required(),
    body: Joi.string().required(),
    location: Joi.object({
        longitude: Joi.number().required(),
        latitude: Joi.number().required()
    }).required()
});

const getNearbyPostsValidator = Joi.object({
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    radius: Joi.number().required()
});


module.exports = {
    createPost: async (req, res) => {

        try {
            const { error } = createPostValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { title, body, location } = req.body;

            // Create a new post
            const newPost = new Post({
                title,
                body,
                createdBy: req.user._id,
                location: {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude]
                }
            });
            await newPost.save();

            res.status(201).json({ message: 'Post created' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },

    getPostsByUser: async (req, res) => {
        try {
            // Find all posts created by the authenticated user
            const posts = await Post.find({ createdBy: req.user._id });

            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getNearbyPosts: async (req, res) => {
        try {
            const { error } = getNearbyPostsValidator.validate(req.query);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }

            const { latitude, longitude, radius } = req.query;

            // Check that radius is a valid number
            if (isNaN(radius)) {
                throw new Error('Invalid radius');
            }

            // Find all posts within the given radius of the given latitude and longitude
            const posts = await Post.find({
                location: {
                    $near: {
                        $maxDistance: radius * 1000, // Convert from km to meters
                        $geometry: {
                            type: 'Point',
                            coordinates: [longitude, latitude]
                        }
                    }
                }
            });

            res.json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },

    getPostCounts: async (req, res) => {
        try {
            const activeCount = await Post.countDocuments({ createdBy: req.user._id, active: true });
            const inactiveCount = await Post.countDocuments({ createdBy: req.user._id, active: false });

            res.json({ active: activeCount, inactive: inactiveCount });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPostById: async (req, res) => {
        try {
            
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const post = await Post.findOne({ _id: req.params.postId, createdBy: req.user._id });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.json(post);
        }
        catch (error) {
            res.status(500).json({ message: error.message })
        }
    },

    updatePost: async (req, res) => {
        try {
            const { error } = updatePostValidator.validate(req.body);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            const { title, body, location, active } = req.body;

            // Find the post by ID and createdBy to ensure the user can update it
            const post = await Post.findOne({ _id: req.params.postId, createdBy: req.user._id });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            // Update the post fields
            if (title) {
                post.title = title;
            }
            if (body) {
                post.body = body;
            }
            if (location) {
                post.location = {
                    type: 'Point',
                    coordinates: [location.longitude, location.latitude]
                };
            }
            if (active !== undefined) {
                post.active = active;
            }

            await post.save();

            res.json({ message: 'Post updated' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deletePostById: async (req, res) => {
        try {
            // Find the post by ID and createdBy to ensure the user can delete it
            const post = await Post.findOne({ _id: req.params.postId, createdBy: req.user._id });
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            await Post.deleteOne({ _id: req.params.postId, createdBy: req.user._id });

            res.json({ message: 'Post deleted' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}