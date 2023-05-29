const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/64d6f66a84a";

    const options = {
        method: "POST",
        auth: "xavier:53533d077767c00fe0af00e88a6c7203-us21"
    };

    const request = https.request(url, options, function(response){

        response.statusCode === 200 ? res.sendFile(__dirname + "/success.html") : res.sendFile(__dirname + "/failure.html");

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();

    //console.log(firstName, lastName, email);
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

//process.env.PORT is used on Heroku's server of choice
app.listen(process.env.PORT || 3000, function(){
    console.log("Listening on port 3000");
});

//API key = 53533d077767c00fe0af00e88a6c7203-us21
//audience id = 64d6f66a84

