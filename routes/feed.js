const express = require("express");

const { body } = require("express-validator");

const feedController = require("../controllers/feed");

const router = express.Router();

// GET / feed / posts
router.get("/posts", feedController.getPosts);

// POST / feed / posts
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPosts
);

// GET / feed / post / :postId
router.get("/post/:postId", feedController.getPost);

module.exports = router;
