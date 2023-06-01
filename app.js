const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

app.use(express.static("public")); /// to use the css and image static files in express server we have to write tic command
app.use(bodyParser.urlencoded({ extended: true })); 

app.post("/",(req,res)=>{
     const firstName = req.body.fName;
     const lastName = req.body.lName;
     const email = req.body.email;
    const data = {
        members: [                          // objects (according to api documentation) of MAILCHIMP
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);  // to convert the objkect data into json data

    //make our request so we cannot use https cuz that only sends get data
    /// but here we have to do post so we will use soomething different // 
    const url = "https://us5.api.mailchimp.com/3.0/lists/{UniqueID};
    const options = {
        method: "POST",
        auth: "rishik1:{API KEY}"
    }

   

    const request = https.request(url,options,(response)=>{

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
    
        }

        response.on("data",(data)=>{
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end()

})

app.post("/failure",(req,res)=>{
    res.redirect("/");  // this will redirect to the home route
})

app.get("/",(req,res)=>{
    res.sendFile(__dirname +"/signup.html");
})



port = 3000;
app.listen(process.env.PORT || port,()=>{    //to run it in heroku server
    console.log(`Server is running on port ${port}`);
})
