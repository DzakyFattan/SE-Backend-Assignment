const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("dotenv").config();

const routes = require("./src/routes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON body parsing
app.use(bodyParser.json());
// CORS middleware
app.use(cors());

// Middleware for serving OpenAPI documentation
const openapiDocument = YAML.load("../../openapi/gofood-service.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get("/", (req, res) => {
  res.send("/api/v1 to use the api");
});

// Mount routes
app.use("/api/v1", routes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
