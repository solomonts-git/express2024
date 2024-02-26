import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

//middleware to parse request body
app.use(express.json());

const mockUsers = [
  { id: 1, username: "degu", displayName: "Degu" },
  { id: 2, username: "tamerat", displayName: "Tamerat" },
  { id: 3, username: "teddy", displayName: "Teddy" },
];

app.get("/", (req, res) => {
  res.send("Hello, World!");
  // res.send({msg:"Hello, World!"});
  // res.status(201).send({msg:"Hello, World!"});
});

app.get("/api/users", (req, res) => {
  console.log(req.query);
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
});

app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ message: "Bad Request" });
  }

  const findUser = mockUsers.find((user) => user.id === parsedId);

  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});

app.post("api/users", (req, res) => {
  // console.log(req.body);
  const { body } = req.body;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});
// put -- used to update the entire request, if you miss
// the data will be lost
app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return res.sendStatus(200);
});

// patch -- used to patch partially
app.patch("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

app.delete("api/users/:id", (req, res) => {
  const {
    params: { id },
  } = req;
  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);
  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);
  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
