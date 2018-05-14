const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.json");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.all("*", function(req, res, next){
    // Log all requests
    console.log(`${req.method} - ${req.url}`);
    next()
});

app.use("/api", require("./routes/apiv1.js"));

const port = process.env.PORT || config.port;
app.listen(port, () => {
    console.log(`Connected to port ${port}`)
});

module.exports = app;