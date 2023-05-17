//jshint esversion:6

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/HTML/signup.html");
})

app.post("/", function (req, res) {
    console.log(req.body.fname);
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }

            }
        ]
    };
    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/{ListId}";

    const options = {
        method: "POST",
        auth: "{username}: {apiKey}"
    }

    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            if (response.statusCode == 200) {
                res.sendFile(__dirname + "/HTML/success.html");
            }
            else {
                res.sendFile(__dirname + "/HTML/failure.html");
            }
        })
    })
    request.write(jsonData);
    request.end();
})

app.post("/", function (req, res) {
    res.sendFile(__dirname + "/HTML/signup.html");
})

app.listen(4000, function () {
    console.log("Server is running on port 4000")
})
