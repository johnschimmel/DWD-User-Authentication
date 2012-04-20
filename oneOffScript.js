/*
    Sample One Off Script
    Demonstrates how to run a one-off script locally or on heroku. This example will print out the email addresses of all users (if any exist)
    
    To Use:
        1) update Procfile - add following line to existing file
            mytask: node oneOffScript.js

        2) To test locally
            foreman start mytask

        3) Execute from Heroku (must be commited and pushed to Heroku first)
            heroku run mytask
*/
            

// base dependencies for script
var mongoose = require('mongoose')
    , db = require('./accessDB');

db.startup(process.env.MONGOLAB_URI); // start the db connectino

// find all users 
db.User.find({}, function(err, users) {
    
    if (users.length == 0) {
        console.log("There are currently no users");
        
    } else {
        
        // loop through and print out all users
        for(i=0; i<users.length; i++) {
            console.log(users[i].email + " " + users[i]._id); //print out user email + mongo document _id
        }
    }
    
    console.log("*******CLOSING DB - SCRIPT SHOULD TERMINATE AS EXPECTED ******");
    db.closeDB(); // <--- VERY IMPORTANT. MUST CLOSE DB WHEN FINISHED.
})

// Demo - print hello world: n
for(i=0; i<10;i++) {
    console.log("hello world: "+ i);
}