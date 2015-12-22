// var sample_geo_data = [{
//         temp_user_id: "1234",
//         user_id: "",
//         latitude: "123.111212",
//         longitude: "63.234344",
//         locality: "Jodhpur",
//         postalCode: "123456",
//         country: "India"
//     }];

var mongodb = require('mongodb');
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://heroku_l7s5s5q7:m5692c2ab57pvc9j8c15o6dqh@ds057244.mongolab.com:57244/heroku_l7s5s5q7';
var db;
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, database) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        //HURRAY!! We are connected. :)
        console.log('Connection established to', url);
        db = database;
        db.collection('geolocation', {
            strict: true
        }, function(err, col3) {
            if (err != null) {
                // Create the collection
                db.createCollection('geolocation', function(err, result) {
                    // Retry to get the collection, should work as it's now created
                    db.collection('geolocation', {
                        strict: true
                    }, function(err, col3) {
                        if (err !== null) {
                            console.log("error while selecting the collection")
                        };
                    });
                });
            }
        });
    }
});

exports.addGeoData = function(req, res) {
    var geo_data = req.body;
    console.log('Adding Geo Data: ' + JSON.stringify(geo_data));
    db.collection('geolocation', function(err, collection) {
        collection.insert(geo_data, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
