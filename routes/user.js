// CHANGE THIS TO YOUR BUCKET NAME
var myBucket = 'heroku_uploads';

/**
  * Module dependencies.
  */  
var db = require('../accessDB')
   , format = require('util').format
   , fs = require('fs');

var knox = require('knox');


var S3Client = knox.createClient({
      key: process.env.AWS_KEY
    , secret: process.env.AWS_SECRET
    , bucket: myBucket
});


module.exports = {

    // app.get('/'...)
    // userRoute.index
    index: function(request, response) {
      
        templateData = {}
        response.render('index.html', templateData);
    },

    // app.get('/register'...)
    getRegister: function(request, response) {
        response.render('register.html');
    },

    // app.post('/register'...)
    postRegister: function(request, response) {
        userData = {
              fname : request.param('firstname')
            , lname : request.param('lastname')
            , email : request.param('email')
            , password : request.param('password')
        }
        
        db.saveUser(userData, function(err,docs) {
            response.redirect('/account');
        });
    },

    postChangePassword : function(request, response) {
        if (request.param('password') == request.param('password2')) {
            
            //look up user
            db.User.findById(request.user._id, function(err, user){
                
                //set the new password
                user.set('password', request.param('password'));
                user.save();
                
                // set Flash message and redirect back to /account
                request.flash("message", "Password was updated");
                response.redirect('/account');
                
            })
            
        } else {
            
            request.flash("message", "Passwords Do Not Match");
            response.redirect('/account');
        }
    },
    
    // app.get('/login', ...
    login: function(request, response) {
        
        templateData = {
             message: request.flash('error')[0] // get error message is received from prior login attempt
        }
        
        response.render('login.html', templateData);
    },

    // app.get('/account', ensureAuthenticated, ...
    getAccount: function(request, response) {
        
        //Get images for user
        db.Images.find({user:request.user._id}, function(err, images){
            templateData = {
                currentUser : request.user,
                s3bucket : S3Client.bucket,
                images : images,
                message : request.flash('message')[0] // get message is received from prior form submission like password change

            }
    
            response.render('account.html', templateData );
            
        })
    },

    getUsers : function(request, response) {
        
        // query for all users only retrieve email and name
        db.User.find({},['email','name.first','name.last'], function(err,users) {
            
            if (err) {
                console.log(err);
                response.send("an error occurred");
            }
            
            response.json(users);
            
        })
        
    },
    
    // app.get('/logout'...)
    logout: function(request, response){
        request.logout();
        response.redirect('/');
    },

    
    uploadPost : function(request, response) {
        
        // 1) Get file information from submitted form
        filename = request.files.image.filename; // actual filename of file
        path = request.files.image.path; //will be put into a temp directory
        type = request.files.image.type; // image/jpeg or actual mime type
        
        caption = request.body.caption;
        
        // 2) create file name with logged in user id + cleaned up existing file name. function defined below.
        cleanedFileName = cleanFileName(request.user._id, filename);
        
        // 3a) We first need to open and read the file
        fs.readFile(path, function(err, buf){

            // 3b) prepare PUT to Amazon S3
            var req = S3Client.put(cleanedFileName, {
              'Content-Length': buf.length
            , 'Content-Type': type
            });
            
            // 3c) prepare 'response' callback from S3
            req.on('response', function(res){
                if (200 == res.statusCode) {

                    // create new Image
                    var newImage = new db.Images({
                          caption : caption
                        , filename : cleanedFileName
                        , user : request.user._id
                    });
                    newImage.save( function(err) {
                        if (err) { 
                            response.send("uhoh, could not save image filename to database.");
                        }
                        
                        request.flash('message','Image uploaded successfully');
                        response.redirect('/account');
                        
                    })
                    
                    
                    /***** EXAMPLE Posting Image to UserSchema profileImage *****/
                    //successful PUT, now save to User document
                    // update $push = push new item into images array
                    /*
                    Image = {
                          caption : caption
                        , filename : cleanedFileName
                    }
                    
                    var conditions = { _id: request.user._id }
                      , update = { profileImage: UserImage }}
                      , options = { multi: false };
                     
                    // run the Mongo update
                    db.User.update(conditions, update, options, function(err, numAffected) {
                        
                        console.log('saved to %s', req.url);
                        response.send("saved to User profileImage");
                        
                    });
                    */

                    
                    
                } else {
                    
                    response.send("an error occurred. unable to upload file to S3.");
                    
                }
            });
            
            // 3d) finally send the content of the file and end
            req.end(buf);
        });
        

        
        
    },
    
    deleteImage : function(request, response) {
        
        imageID = request.params.imageID;
        
        // get image from DB
        db.Images.findById(imageID, function(err, image) {
            
            if (err) {
                request.flash("message","error, could not find image");
                response.redirect('/account');
            }
            
            if (image && (image.user.toString() == request.user._id.toString()) ) {
                
                // user owns this image
                // 
                S3Client.deleteFile(image.filename, function(err, s3response){
                    if (err) {
                        request.flash("message","an error occurred trying to delete image from S3");
                        response.redirect('/account');

                    }
                    
                    if (204 == s3response.statusCode) {
                        //delete from Mongo
                        var query = db.Images.findById(imageID);
                        query.remove(function(err, queryResponse){
                            
                            request.flash("message","Image removed from S3 and Mongo");
                            response.redirect('/account');
                            
                        })
                    } 
                });
                
                
            } else {
                
                request.flash("message", "unable to delete image");
                response.redirect("/account");
            }
            
        })
        
        
    }

};

var cleanFileName = function(userID, filename) {
    
    // cleans and generates new filename for example userID=abc123 and filename="My Pet Dog.jpg"
    // will return "abc123_my_pet_dog.jpg"
    fileParts = filename.split(".");
    
    //get the file extension
    fileExtension = fileParts[fileParts.length-1]; //get last part of file
    
    //add time string to make filename a little more random
    d = new Date();
    timeStr = d.getTime();
    
    //name without extension "My Pet Dog"
    newFileName = fileParts[0];
    
    return newFilename = userID + "_" + timeStr + "_" + fileParts[0].toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'_') + "." + fileExtension;
    
}
