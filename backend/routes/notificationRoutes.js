const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

router.get("/", controller.getAll);
router.put("/:id/read", controller.markRead);
router.delete("/:id", controller.remove);

module.exports = router;
