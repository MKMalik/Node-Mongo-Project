const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const User = require('./models/user.model');
const authenticate = require('./middlewares/auth.middleware');

const authController = require('./controllers/auth.controller');
const postController = require('./controllers/post.controller');


const express = require('express');
const app = express();

app.use(express.json());

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to database'))
    .catch((error) => console.log('error: ', error.message));




const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
        const user = await User.findById(jwtPayload.id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
}));

app.post('/register', authController.register);
app.post('/login', authController.login);


app.post('/posts', authenticate, postController.createPost);
app.get('/posts', authenticate, postController.getPostsByUser);
app.get('/posts/nearby', authenticate, postController.getNearbyPosts);
app.get('/posts/count', authenticate, postController.getPostCounts);
app.get('/posts/:postId', authenticate, postController.getPostById);
app.patch('/posts/:postId', authenticate, postController.updatePost);
app.delete('/posts/:postId', authenticate, postController.deletePostById);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
