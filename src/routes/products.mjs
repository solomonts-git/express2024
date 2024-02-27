import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.cookies); // this will not work without third party parser
  // console.log(req.headers.cookies) this will work since it is parsed manually
  if (req.cookies.hello && req.cookies.hello === "world") {
    res.send({ id: 1, item: "doro wot", msg: "you order doro wot" });
  }
  return res.send({ msg: "Sorry, You need the correct cookie" });
});
export default router;
