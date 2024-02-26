import express from "express";
import { query, validationResult, body, matchedData } from "express-validator";

const app = express();

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "degu", displayName: "Degu" },
  { id: 2, username: "tamerat", displayName: "Tamerat" },
  { id: 3, username: "teddy", displayName: "Teddy" },
];
//middleware to parse request body
app.use(express.json());

const resolveIndexByUserId = (req, res, next) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  // since there is no formal way to transfer data b/n middlewares
  // attach property to request
  req.findUserIndex = findUserIndex;
  next();
};

app.get("/", (req, res) => {
  res.send("Hello, World!");
  // res.send({msg:"Hello, World!"});
  // res.status(201).send({msg:"Hello, World!"});
});

app.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("should be string")
    .notEmpty()
    .withMessage("should not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("filter should be between 3 and 10"),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    const {
      query: { filter, value },
    } = req;
    // when filter and value are undefined
    if (!filter && !value) {
      return res.send(mockUsers);
    }
    if (filter && value) {
      return res.send(mockUsers.filter((user) => user[filter].includes(value)));
    } else {
      res.send(mockUsers);
    }
  }
);

app.get("/api/users/:id", (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});
// here we use validation in the code, we can simplify by
// using checkSchema() method from express-validator
app.post(
  "/api/users",
  body("username")
    .notEmpty()
    .withMessage("username cannot be empty")
    .isString()
    .withMessage("should be string")
    .isLength({ min: 5, max: 32 })
    .withMessage(
      "username must be atleast 5 character with a max of 32 characters"
    ),
  (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(request);

    // const { body } = req.body;
    //const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    //use validated data instead of request data
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    return res.status(201).send(newUser);
  }
);

// put -- used to update the entire request, if you miss
// the data will be lost
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

// patch -- used to patch partially
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
