import { Router } from "express";
import { query, validationResult, body, matchedData } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";

const router = Router();

router.get(
  "/api/users",
  query("filter")
    .isString()
    .withMessage("should be string")
    .notEmpty()
    .withMessage("should not be empty")
    .isLength({ min: 3, max: 10 })
    .withMessage("filter should be between 3 and 10"),
  (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
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
router.get("/api/users/:id", (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];
  if (!findUser) return res.sendStatus(404);

  return res.send(findUser);
});
router.post(
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
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

// patch -- used to patch partially
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

router.delete("api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

export default router;
