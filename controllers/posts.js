const express = require("express");
const mongoose = require("mongoose");

const PostMessage = require("../models/postMessage.js");
const { APIResponse } = require("../utility/APIResponse.js");
const HttpStatusCode = require("../utility/HttpStatusCode.js");
const Result = require("../utility/Result.js");
const logger = require("../config/logger/logger.config.js");

// const router = express.Router();

const getPosts = async (request, response) => {
  logger.info("PostController ---> getPosts ---> Reached");
  const { page } = request.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    logger.info("PostController ---> getPosts ---> End");
    response.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    logger.error("PostController ---> getPosts ---> Error: ", error);
    response.status(404).json({ message: error.message });
  }
};

const getPostsBySearch = async (req, res) => {
  logger.info("PostController ---> getPostsBySearch ---> Reached");
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] });
    logger.info("PostController ---> getPostsBySearch ---> End");
    res.status(201).json({ data: posts });
  } catch (error) {
    logger.error("PostController ---> getPostsBySearch ---> Error: ", error);
    res.status(404).json({ message: error.message });
  }
};

const getPostsByCreator = async (req, res) => {
  logger.info("PostController ---> getPostsByCreator ---> Reached");
  const { name } = req.query;
  try {
    const posts = await PostMessage.find({ name });
    logger.info("PostController ---> getPostsByCreator ---> End");
    res.status(201).json({ data: posts });
  } catch (error) {
    logger.error("PostController ---> getPostsByCreator ---> Error: ", error);
    res.status(404).json({ message: error.message });
  }
};

const getPost = async (req, res) => {
  logger.info("PostController ---> getPost ---> Reached");
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);
    logger.info("PostController ---> getPost ---> End");
    res.status(200).json(post);
  } catch (error) {
    logger.error("PostController ---> getPost ---> Error: ", error);
    res.status(404).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  logger.info("PostController ---> createPost ---> Reached");
  const post = req.body;
  const newPostMessage = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() });
  try {
    await newPostMessage.save();
    logger.info("PostController ---> createPost ---> End");
    res.status(201).json(newPostMessage);
  } catch (error) {
    logger.error("PostController ---> createPost ---> Error: ", error);
    res.status(409).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  logger.info("PostController ---> updatePost ---> Reached");
  try {
    const { id } = req.params;
    const { title, message, creator, selectedFile, tags } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const updatedPost = { creator, title, message, tags, selectedFile, _id: id };
    await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });
    logger.info("PostController ---> updatePost ---> End");
    res.status(201).json(updatedPost);
  } catch (error) {
    logger.error("PostController ---> updatePost ---> Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  logger.info("PostController ---> deletePost ---> Reached");
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    await PostMessage.findByIdAndRemove(id);
    logger.info("PostController ---> deletePost ---> End");
    res.status(201).json({ message: "Post deleted successfully." });
  } catch (error) {
    logger.error("PostController ---> deletePost ---> Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

const likePost = async (req, res) => {
  logger.info("PostController ---> likePost ---> Reached");
  try {
    const { id } = req.params;
    if (!req.userId) {
      logger.info(`PostController ---> likePost ---> User not found: ${req.userId}`);
      return res.status(403).json({ message: "User is Unauthenticated" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
    const post = await PostMessage.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    logger.info("PostController ---> likePost ---> End");
    res.status(200).json(updatedPost);
  } catch (error) {
    logger.error("PostController ---> likePost ---> Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

const commentPost = async (req, res) => {
  logger.info("PostController ---> commentPost ---> Reached");
  try {
    const { id } = req.params;
    const { value } = req.body;
    const post = await PostMessage.findById(id);
    post.comments.push(value);
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });
    logger.info("PostController ---> commentPost ---> End");
    res.json(updatedPost);
  } catch (error) {
    logger.error("PostController ---> commentPost ---> Error: ", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPost,
  getPosts,
  updatePost,
  deletePost,
  likePost,
  createPost,
  commentPost,
  getPostsByCreator,
  getPostsBySearch,
};
