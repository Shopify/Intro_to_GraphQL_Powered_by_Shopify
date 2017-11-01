// Load Express and Database Libraries
var express = require("express");
var port = process.env.PORT || 5000;

// Create a new Express application
var app = express();

// Serve files in the /public directory
app.use(express.static("public"));

// Start the server on port 5000
app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));
