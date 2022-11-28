const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("newPage", { title: "A new page" });
});

module.exports = router;
