A boilerplate to use NodeJS, Express & Passport with MongoDB on Heroku!

Much of this code was possible from Raquel Vélez's [CrowdNotes project](https://github.com/rockbot/CrowdNotes)
And Raquel's notes on [Mongoose Auth --> Passport](http://raquelvelez.com/blog/2012/03/transitioning-from-mongoose-auth-to-passport/)

# Set up file structure and Heroku App

In your terminal, clone this repo

	git clone git@github.com:johnschimmel/DWD-User-Authentication.git


If you haven't already, create a new app on Heroku (cedar), this will add an additional remote GIT path to Heroku. (Assumes you have [Heroku Toolbelt](https://toolbelt.heroku.com/) installed)

	heroku create --stack cedar

# Set up MongoDB and .env

Add free [MongoLab account add-on](https://addons.heroku.com/mongolab) for your MongoDB 

	heroku addons:add mongolab:starter

Heroku and MongoLab have provided a mongodb:// connection string in your Heroku config. This is your "username and password" to get access. We can keep the connection string out of the code and private by putting it inside a .env environment variable file. 

Get your connection URI

	heroku config | grep MONGOLAB_URI

Copy the Mongo URI connection string starting from **mongodb://** to the end, will look like

    mongodb://heroku_randomapp:hashedpassword@subdomain.mongolab.com:port/heroku_randomapp
    
Add local config variable for MongoLab

    echo MONGOLAB_URI=mongodb://heroku_randomapp:hashedpassword@subdomain.mongolab.com:port/heroku_randomapp >> .env
    
Add Amazon S3 config variables for local dev

    echo AWS_KEY=YOUR_AWS_KEY >> .env
    echo AWS_SECRET=YOUR_AWS_SECRET >> .env

Add Amazon S3 config variables to Heroku config

    heroku config:add AWS_KEY=YOUR_AWS_KEY AWS_SECRET=YOUR_AWS_SECRET
    
When you start your Heroku app with 

    foreman start
    
You have access to the MONGOLAB_URI with this variable

    process.env.MONGOLAB_URI
    
This will also run when deployed to Heroku

# Install Node Modules

    npm install
    
# Run locally

    foreman start
    
Visit on your browser at [http://localhost:5000](http://localhost:5000)

------- 

# Run on Heroku

Commit all changes

    git commit -am "my commit message"
    
Push to Heroku

    git push heroku master
    
Open in browser the lazy man way

    heroku open
    
