import express from "express";
import usersRouter from "./routes/users.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

//middleware to parse request body
app.use(express.json());
app.use(usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
  // res.send({msg:"Hello, World!"});
  // res.status(201).send({msg:"Hello, World!"});
});

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
