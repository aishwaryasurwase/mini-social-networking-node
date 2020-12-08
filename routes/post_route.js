const express = require('express');
const router = express.Router();
const PostController = require('../controllers/post_controller');
const checkAuth = require("../backend/middleware/check-auth");
const fileMulter = require("../backend/middleware/file-multer");

router.get('/api/posts', PostController.getPosts)

router.get('/api/getPostById/:id', PostController.getPost);

router.put('/api/editPost/:id', checkAuth, fileMulter, PostController.updatePost);

router.post('/api/addPost', checkAuth, fileMulter, PostController.addPost);

router.delete('/api/deletePost/:id', checkAuth, PostController.deletePost);

router.use('/api/signup', PostController.createUser)

router.post('/api/login', PostController.loginUser);
module.exports = router;