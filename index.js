var express = require('express'); 
var profile = require('.routes/profile');
var venues = require('.routes/venues');
var favVenue = require('.routes/favVenue');
var app = express(); 

app.configure(function () { 
	app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */ 
    app.use(express.bodyParser()); 
});

// Profile services
app.get('/profile/:id', profile.findById); 
app.post('/profile', wine.addProfile); 
app.put('/profile/:id', wine.updateProfile); 
// app.delete('/profile/:id', wine.deleteProfile); 

// Yo services
// Notabin get profile id from session
app.get('/yoList', yoList.FindAll);
app.get('/yoList/:id', yoList.findById);

// No services
// Notabin get profile id from session
app.get('/noList', noList.FindAll);
app.get('/noList/:id', noList.findById);

// Venue services
// Get Details like geo, chekkar etc from session
// Get all suggestion from foursquare and google places
app.get('/venueByGeo', getVenuesRecommendationByGeoLocation);
app.get('/venueByLikes', getVenuesRecommedationByLikes);
app.get('/venueByMovie');
app.get('/venueByClubs');
app.get('/venueByDessert');
app.get('/venueByTopPick');
app.get('/venueByCoffee');


// Favorite Venues
app.get('/getFavVenueList', favVenue.getFavVenueList);
app.get('/getFavVenueList/:id' favVenue,getFavVenueById);
app.post('/addFavVenue', favVenue.addFavVenue);

app.listen(3000);
console.log('Listening on port 3000...');