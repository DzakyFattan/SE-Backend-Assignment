const pool = require("./db");

const getTrip = async (req, res) => {
  try {
    const trip_id = req.params.trip_id;
    const trip = await pool.query("SELECT * FROM trips WHERE trip_id = $1", [
      trip_id,
    ]);
    if (!trip.rows.length) {
      return res.status(404).json({ message: "Trip not found" });
    }
    res
      .status(200)
      .json({ message: "Trip detail retrieved", trip: trip.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestTrip = async (req, res) => {
  try {
    const { driver_id, start_location, end_location, fare } = req.body;
    // get the user_id from the token
    const user_id = req.user.user_id;

    // check if the driver is available
    const driver = await pool.query(
      "SELECT * FROM drivers WHERE driver_id = $1",
      [driver_id]
    );
    if (!driver.rows.length) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // check if there is accept in query param
    if (req.query.accept) {
      const trip_id = req.query.accept;
      // check if the trip exists
      const trip = await pool.query("SELECT * FROM trips WHERE trip_id = $1", [
        trip_id,
      ]);
      if (!trip.rows.length) {
        return res.status(404).json({ message: "Trip not found" });
      }
      // check if the trip is already accepted
      if (trip.rows[0].current_status === "accepted") {
        return res.status(400).json({ message: "Trip already accepted" });
      }
      const acceptRide = await pool.query(
        "UPDATE trips SET current_status = 'accepted' WHERE trip_id = $1 RETURNING *",
        [trip_id]
      );

      return res.status(200).json({
        message: "Ride accepted",
        ride: acceptRide.rows[0],
      });
    } else if (req.query.cancel) {
      const trip_id = req.query.cancel;
      // check if the trip exists
      const trip = await pool.query("SELECT * FROM trips WHERE trip_id = $1", [
        trip_id,
      ]);
      if (!trip.rows.length) {
        return res.status(404).json({ message: "Trip not found" });
      }
      // check if the trip is already cancelled
      if (trip.rows[0].current_status === "cancelled") {
        return res.status(400).json({ message: "Trip already cancelled" });
      }
      const cancelRide = await pool.query(
        "UPDATE trips SET current_status = 'cancelled' WHERE trip_id = $1 RETURNING *",
        [trip_id]
      );

      return res.status(200).json({
        message: "Ride cancelled",
        ride: cancelRide.rows[0],
      });
    } else if (req.query.complete) {
      const trip_id = req.query.complete;
      // check if the trip exists
      const trip = await pool.query("SELECT * FROM trips WHERE trip_id = $1", [
        trip_id,
      ]);
      if (!trip.rows.length) {
        return res.status(404).json({ message: "Trip not found" });
      }
      // check if the trip is already completed
      if (trip.rows[0].current_status === "completed") {
        return res.status(400).json({ message: "Trip already completed" });
      }
      const completeRide = await pool.query(
        "UPDATE trips SET current_status = 'completed' WHERE trip_id = $1 RETURNING *",
        [trip_id]
      );

      return res.status(200).json({
        message: "Ride completed",
        ride: completeRide.rows[0],
      });
    }
    const newRide = await pool.query(
      "INSERT INTO trips (user_id, driver_id, start_location, end_location, fare) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [driver_id, user_id, start_location, end_location, fare]
    );

    res.status(201).json({ message: "Ride requested", ride: newRide.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getTrip, requestTrip };
