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
        db.collection('wines', {
            safe: true
        }, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
                populateDB();
            } else {
                console.log("collection IS " + JSON.stringify(collection));
            }
        });
    }
});

// var server = new Server("heroku_l7s5s5q7:m5692c2ab57pvc9j8c15o6dqh@ds057244.mongolab.com", 57244, {
//     auto_reconnect: true
// });
// db = new Db('heroku_l7s5s5q7', server, {
//     safe: true
// });

// db.open(function(err, db) {
//     if (!err) {
//         console.log("Connected to 'chekkar' database");
//         db.collection('wines', {
//             safe: true
//         }, function(err, collection) {
//             if (err) {
//                 console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
//                 populateDB();
//             }
//         });
//     }
// });


exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.findOne({
            '_id': new BSON.ObjectID(id)
        }, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {
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

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    delete wine._id;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({
            '_id': new BSON.ObjectID(id)
        }, wine, {
            safe: true
        }, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({
                    'error': 'An error has occurred'
                });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.remove({
            '_id': new BSON.ObjectID(id)
        }, {
            safe: true
        }, function(err, result) {
            if (err) {
                res.send({
                    'error': 'An error has occurred - ' + err
                });
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var wines = [{
        name: "CHATEAU DE SAINT COSME",
        year: "2009",
        grapes: "Grenache / Syrah",
        country: "France",
        region: "Southern Rhone",
        description: "The aromas of fruit and spice give one a hint of the light drinkability of this lovely wine, which makes an excellent complement to fish dishes.",
        picture: "saint_cosme.jpg"
    }, {
        name: "WATERBROOK",
        year: "2009",
        grapes: "Merlot",
        country: "USA",
        region: "Washington",
        description: "Legend has it the gods didn't share their ambrosia with mere mortals.  This merlot may be the closest we've ever come to a taste of heaven.",
        picture: "waterbrook.jpg"
    }];

    db.collection('wines', function(err, collection) {
        if (err) {
            console.log("error while creating collection " + JSON.stringify(err));
        } else {
            collection.insert(wines, {
                safe: true
            }, function(err, result) {});
        }
    });

};
