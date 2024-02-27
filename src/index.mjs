import express from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const app = express();

const PORT = process.env.PORT || 3000;

//middleware to parse request body
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "secretshouldbecomplex",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);

app.use(usersRouter);
app.use(productsRouter);

app.get("/", (req, res) => {
  res.cookie("Hello", "World", { maxAge: 60000 * 60 * 2 });
  req.session.visited = true;
  console.log(req.session);
  console.log(req.session.id);

  res.send("Hello, World!");
  // res.send({msg:"Hello, World!"});
  // res.status(201).send({msg:"Hello, World!"});
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = mockUsers.find((user) => user.username === username);

  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: "BAD CREDENTIALS" });
  }
  req.session.user = findUser;
  return res.status(200).send(findUser);
});
app.get("/api/auth/status", (req, res) => {
  return req.session.user
    ? response.status(200).send(request.session.user)
    : res.status(401).send({ msg: "Not Authenticated" });
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus;
  const { body: item } = req;
  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});
app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
