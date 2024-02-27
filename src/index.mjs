import express from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
const app = express();

const PORT = process.env.PORT || 3000;

//middleware to parse request body
app.use(express.json());
app.use(cookieParser());
app.use(usersRouter);
app.use(productsRouter);

app.get("/", (req, res) => {
  res.cookie("Hello", "World", { maxAge: 60000 * 60 * 2 });
  res.send("Hello, World!");
  // res.send({msg:"Hello, World!"});
  // res.status(201).send({msg:"Hello, World!"});
});

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
