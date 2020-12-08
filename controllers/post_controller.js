const User = require("../models/user_model");
const Post = require('../models/post_model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        })
        user.save().then(result => {
            res.status(201).json({ message: "User created successfully", data: result });
        }).catch(err => {
            res.status(400).json({ message: err })
        })
    })
}

exports.loginUser = (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        userData = user;
        if (!user) {
            return res.status(400).json({ message: "Auth failed" });
        }
        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(400).json({ message: "Auth failed" });
        }
        const token = jwt.sign({ email: userData.email, userId: userData._id },
            "mini_social_networking_project_in_angular",
            { expiresIn: '1h' });
        // console.log("Token ", token);
        res.status(200).json({ token: token, expiresIn: 3600, userId: userData._id });
    }).catch(err => {
        return res.status(400).json({ message: err });
    })
}

exports.getPosts = (req, res, next) => {
    const pagesize = Number(req.query.pagesize);
    const currentpage = Number(req.query.currentpage);
    let fetchedPost;

    const postQuery = Post.find();
    if (pagesize && currentpage) {
        postQuery.skip(pagesize * (currentpage - 1)).limit(pagesize);
    }

    postQuery.then(doc => {
        fetchedPost = doc;
        return Post.count();
    }).then(count => {
        // console.log("count ", count);
        res.status(200).json({
            message: 'Posts data fetched successfully!',
            posts: fetchedPost,
            maxPosts: count
        })
    }).catch(err => {
        console.log("error ", err);
        res.status(400).json({ message: err })
    })

}

exports.updatePost =  (req, res) => {
    // console.log(req.params.id, req.body);
    if (req.file) {
        const url = req.protocol + "://" + req.get('host');
        imagePath = url + "/images/" + req.file.filename
    } else {
        imagePath = req.body.image
    }
    let post = {
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
    }
    // console.log("POST ", post);
    Post.findOneAndUpdate({ _id: req.params.id, creator: req.userData.userId }, post).then((post) => {
        console.log("POST updated ", post);
        if (!post) {
            res.status(401).json({ data: 'Failed to update, user validation failed', post: post });
        } else {
            res.status(200).json({ data: "updated post", post: post });
        }
    }).catch((err) => {
        // console.log("error ", err);
        res.status(401).json({ message: err });
    })
}

exports.addPost = (req, res, next) => {
    // let token = req.headers['authorization'];
    // token = token.split(' ');
    // token = token[1];
    // console.log("token", token[1]);

    // const jwtVerify = jwt.verify(token, "mini_social_networking_project_in_angular");
    // console.log("Jwt verify ", jwtVerify);

    // if (jwtVerify) {
    // console.log("UserData ", req.userData);
    const url = req.protocol + "://" + req.get('host')
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId
    })
    // console.log("post ", post);
    post.save().then(() => {
        res.status(201).json({
            message: 'Post added successfully',
            post: post
        })
    }).catch(err => {
        res.status(400).json({
            message: err
        })
    });
    // } else {
    //     res.status(400).json({
    //         message: 'Error in validating token'
    //     })
    // }
}

exports.deletePost =  (req, res) => {
    console.log("ID ", req.params.id);
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(
        (doc) => {
            // console.log("doc", doc);
            if (doc.deletedCount > 0) {
                res.status(200).json({
                    message: 'Post deleted successfully'
                })
            } else {
                res.status(401).json({
                    message: 'Failed to delete the post'
                })
            }

        }
    ).catch(err => {
        res.status(500).json({
            message: err
        })
    })
}

exports.getPost = (req, res) => {
    // console.log("req", req.params.id);
    Post.findOne({ _id: req.params.id }).then(result => {
        console.log("result", result);
        res.status(200).json({ post: result });
    }).catch(err => {
        res.status(400).json({ message: err });
    })
}