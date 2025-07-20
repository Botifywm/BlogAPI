const express = require("express");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

const apiRouter = require("./routes/apiRouter");
app.use("/api", apiRouter);

const PORT = 3030;
app.listen(PORT, () =>
  console.log(`My first Upload app - listening on port ${PORT}!`)
);
