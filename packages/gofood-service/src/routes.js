const { Router } = require("express");

const { getOrder, requestFood } = require("./controller");
const authorizeUser = require("./auth");

const router = Router();

// Get trip route
router.get("/:order_id", authorizeUser, getOrder);

// Request trip route
router.post("/food", authorizeUser, requestFood);

module.exports = router;
