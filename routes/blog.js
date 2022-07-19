const express  =require("express");
const { getPost, addPost, editPost, deletePost, likePost, addComment, deleteComment, editComment } = require("../controllers/blogController");
const Router= express.Router();


Router.use("/:id").get(getPost).post(addPost).patch(editPost).delete(deletePost);

Router.post("/:id/like",likePost)

Router.use("/:id/comment/:commentId").post(addComment).delete(deleteComment).patch(editComment);