const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function createPosts(req, res) {
  try {
    const { title, content, imageUrl, published } = req.body;
    if (req.user.role !== "author") {
      return res.status(403).json({ error: "Only authors can create posts" });
    }
    const posting = await prisma.post.create({
      data: {
        title: title,
        content: content,
        imageUrl: imageUrl || "",
        published: published,
        authorId: req.user.id,
      },
    });
    res.status(201).json({ message: "Post Created!" });
  } catch (error) {
    res.status(500).json({ error: "Post not created" });
  }
}

async function getAllPosts(req, res) {
  try {
    console.log("aallpost");
    const allPosts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    res.status(200).json(allPosts);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}

async function getPost(req, res) {
  const postId = req.params.postId;
  const currentUser = req.user;
  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if (currentUser) {
      res.status(200).json({ ...post, currentUserId: currentUser.id });
    } else {
      res.status(200).json(post);
    }
  } catch (error) {
    res.status(500).json({ error: "Cannot fetch posts" });
  }
}

async function updatePost(req, res) {
  const postId = req.params.postId;
  const { title, content, imageUrl, published } = req.body;
  if (req.user.role !== "author") {
    return res.status(403).json({ error: "Only authors can update posts" });
  }
  try {
    await prisma.post.update({
      where: { id: postId },
      data: {
        title: title,
        content: content,
        imageUrl: imageUrl || "",
        published: published,
      },
    });
    res.status(200).json({ success: "Update sucessful" });
  } catch (error) {
    res.status(500).json({ error: "Update failed." });
  }
}

async function deletePost(req, res) {
  const postId = req.params.postId;
  if (req.user.role !== "author") {
    return res.status(403).json({ error: "Only authors can create posts" });
  }
  try {
    await prisma.post.delete({
      where: { id: postId },
    });
    res.status(200).json({ success: "Delete sucessful" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed." });
  }
}

async function createComment(req, res) {
  const postId = req.params.postId;
  const content = req.body.content;
  const userId = req.user.id;

  try {
    await prisma.comment.create({
      data: {
        content: content,
        postId: postId,
        userId: userId,
      },
    });
    await prisma.session.fin;
    res.status(200).json({ success: "Comment created." });
  } catch (error) {
    res.status(500).json({ error: "Comment not created" });
  }
}

async function updateComment(req, res) {
  const commentId = req.params.commentId;
  const userId = req.user.id;
  const content = req.body.content;

  try {
    const updating = await prisma.comment.updateMany({
      where: { id: commentId, userId: userId },
      data: {
        content: content,
      },
    });
    if (updating.count === 0) {
      return res
        .status(403)
        .json({ error: "Not allowed to update this comment." });
    } else {
      res.status(200).json({ success: "Comment updated." });
    }
  } catch (error) {
    res.status(500).json({ error: "Update failed." });
  }
}

async function deleteComment(req, res) {
  const commentId = req.params.commentId;
  try {
    await prisma.comment.delete({
      where: { id: commentId },
    });
    res.status(200).json({ success: "Comment deleted." });
  } catch (error) {
    res.status(500).json({ error: "Delete failed." });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userAdded = await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });
    res.status(200).json(userAdded);
  } catch (error) {
    res.status(500).json({ error: "Error creating user", another: error });
  }
}

async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    if (!user)
      return res.status(401).json({ error: "Invalid User or Password" });

    const pw = await bcrypt.compare(password, user.password);
    if (!pw) return res.status(401).json({ error: "Invalid User or Password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in." });
  }
}

async function loginAdmin(req, res) {
  const { username, password } = req.body;

  try {
    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    if (!user || user.role !== "author")
      return res.status(401).json({ error: "Invalid User or Password" });

    const pw = await bcrypt.compare(password, user.password);
    if (!pw) return res.status(401).json({ error: "Invalid User or Password" });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in." });
  }
}

module.exports = {
  createPosts,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment,
  createUser,
  loginUser,
  loginAdmin,
};
