import express from "express";

const app = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
  // res.send({msg:"Hello, World!"});
  // res.status(201).send({msg:"Hello, World!"});
});

app.get("/api/users", (req, res) => {
  res.send([
    { id: 1, username: "degu", displayName: "Degu" },
    { id: 2, username: "tamerat", displayName: "Tamerat" },
    { id: 3, username: "teddy", displayName: "Teddy" },
  ]);
});

app.listen(PORT, () => {
  console.log(`Server start at ${PORT}`);
});
