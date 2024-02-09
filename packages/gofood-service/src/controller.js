const pool = require("./db");

const getOrder = async (req, res) => {
  try {
    const order_id = req.params.order_id;
    const order = await pool.query("SELECT * FROM orders WHERE order_id = $1", [
      order_id,
    ]);
    if (!order.rows.length) {
      return res.status(404).json({ message: "Order not found" });
    }
    res
      .status(200)
      .json({ message: "Order detail retrieved", order: order.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const requestFood = async (req, res) => {
  try {
    const { food_id, quantity } = req.body;
    // get the user_id from the token
    const user_id = req.user.user_id;

    // check if the food exists
    const food = await pool.query("SELECT * FROM foods WHERE food_id = $1", [
      food_id,
    ]);
    if (!food.rows.length) {
      return res.status(404).json({ message: "Food not found" });
    }

    // check if there is process in query param
    if (req.query.process) {
      const order_id = req.query.process;
      // check if the order exists
      const order = await pool.query(
        "SELECT * FROM orders WHERE order_id = $1",
        [order_id]
      );
      if (!order.rows.length) {
        return res.status(404).json({ message: "Order not found" });
      }
      // check if the order is already processed
      if (order.rows[0].current_status === "processing") {
        return res.status(400).json({ message: "Order already in processing" });
      }
      const processOrder = await pool.query(
        "UPDATE orders SET current_status = 'processing' WHERE order_id = $1 RETURNING *",
        [order_id]
      );

      return res.status(200).json({
        message: "Order is being processed",
        ride: processOrder.rows[0],
      });
    } else if (req.query.cancel) {
      const order_id = req.query.cancel;
      // check if the order exists
      const order = await pool.query(
        "SELECT * FROM orders WHERE order_id = $1",
        [order_id]
      );
      if (!order.rows.length) {
        return res.status(404).json({ message: "Order not found" });
      }
      // check if the order is already cancelled
      if (order.rows[0].current_status === "cancelled") {
        return res.status(400).json({ message: "Order already cancelled" });
      }
      const cancelOrder = await pool.query(
        "UPDATE orders SET current_status = 'cancelled' WHERE order_id = $1 RETURNING *",
        [order_id]
      );

      return res.status(200).json({
        message: "Order cancelled",
        ride: cancelOrder.rows[0],
      });
    } else if (req.query.complete) {
      const order_id = req.query.complete;
      // check if the order exists
      const order = await pool.query(
        "SELECT * FROM orders WHERE order_id = $1",
        [order_id]
      );
      if (!order.rows.length) {
        return res.status(404).json({ message: "Order not found" });
      }
      // check if the order is already completed
      if (order.rows[0].current_status === "completed") {
        return res.status(400).json({ message: "Order already completed" });
      }
      const completeOrder = await pool.query(
        "UPDATE orders SET current_status = 'completed' WHERE order_id = $1 RETURNING *",
        [order_id]
      );

      return res.status(200).json({
        message: "Order completed",
        ride: completeRide.rows[0],
      });
    }
    const newRide = await pool.query(
      "INSERT INTO orders (user_id, food_id, quantity, VALUES ($1, $2, $3) RETURNING *",
      [user_id, food_id, quantity]
    );

    res.status(201).json({ message: "Ride requested", ride: newRide.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getOrder, requestFood };
