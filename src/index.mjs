import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

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

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
