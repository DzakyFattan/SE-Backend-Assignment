const { Router } = require("express");

const { getTrip, requestTrip } = require("./controller");
const authorizeUser = require("./auth");

const router = Router();

// Get trip route
router.get("/:trip_id", authorizeUser, getTrip);

// Request trip route
router.post("/trip", authorizeUser, requestTrip);

module.exports = router;
