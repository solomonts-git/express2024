import express from "express";
import usersRouter from "./routes/users.mjs";
import productsRouter from "./routes/products.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/local-strategy.mjs";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

const app = express();

mongoose
  .connect("mongodb://0.0.0.0:27017/express_tutorial")
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(`Error: ${err}`));

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
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

app.use(passport.initialize());
//used to attach dynamic property user
app.use(passport.session());
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

app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

app.get("/api/auth/status", (req, res) => {
  console.log("Inside /auth/status endpoint");
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(user) : res.sendStatus(401);
});
app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
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
