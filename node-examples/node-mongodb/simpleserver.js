var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');

// Database connection URL
var url = 'mongodb://localhost:27017/conFusion';

mongoClient.connect(url, function(err, db){
	assert.equal(err, null);
	console.log("Connected correctly to the server");

	var collection = db.collection("dishes");

	collection.insertOne({name:'Pizza',description:"test description"}, function(err, result){
		assert.equal(err, null);
		console.log("Afer insert:");
		console.log(result.ops);

		collection.find({}).toArray(function(err, docs){
			assert.equal(err, null);
			console.log("Found:");
			console.log(docs);

			db.dropCollection("Dishes", function(){
				assert.equal(err, null);
				db.close();
			});
		});
	});
});