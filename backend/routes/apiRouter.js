const { Router } = require("express");
const apiRouter = Router();
const apiController = require("../controller/apiController");
const verifyToken = require("../authMiddleware/jwtAuth");

// users
apiRouter.post("/register", apiController.createUser);
apiRouter.post("/login", apiController.loginUser);

// Admin
apiRouter.post("/loginAdmin", apiController.loginAdmin);
apiRouter.post("/createPost", verifyToken, apiController.createPosts);
apiRouter.put("/updatePost/:postId", verifyToken, apiController.updatePost);
apiRouter.delete("/deletePost/:postId", verifyToken, apiController.deletePost);

// Public
apiRouter.get("/getAllPosts", apiController.getAllPosts);
apiRouter.get("/getPostPublic/:postId", apiController.getPost);
apiRouter.get("/getPost/:postId", verifyToken, apiController.getPost);
apiRouter.post(
  "/createComment/:postId",
  verifyToken,
  apiController.createComment
);
apiRouter.put(
  "/updateComment/:commentId",
  verifyToken,
  apiController.updateComment
);
apiRouter.delete(
  "/deleteComment/:commentId",
  verifyToken,
  apiController.deleteComment
);

module.exports = apiRouter;
