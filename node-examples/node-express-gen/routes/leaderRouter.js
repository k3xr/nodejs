var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Leadership = require('../models/leadership');

var leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
	Leadership.find({}, function (err, leader) {
		if (err) throw err;
		res.json(leader);
	});
})

.post(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
	Leadership.create(req.body, function (err, leader) {
		if (err) throw err;
		console.log('Leader created!');
		var id = leader._id;

		res.writeHead(200, {
			'Content-Type': 'text/plain'
		});
		res.end('Added the leader with id: ' + id);
	});    
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next){
	Leadership.remove({}, function (err, resp) {
		if (err) throw err;
		res.json(resp);
	});
});

leaderRouter.route('/:leaderId')
.all(Verify.verifyOrdinaryUser, function(req,res,next) {
	var validId = mongoose.Types.ObjectId.isValid(req.params.leaderId);
	if(!validId){
		var err = new Error('Not Found');
		err.status = 404;
		return next(err);
	}
	else{
		next();
	}
})

.get(function(req,res,next){
	Leadership.findById(req.params.leaderId, function (err, leader) {
		if (err) throw err;
		res.json(leader);
	});
})

.put(Verify.verifyAdmin, function(req, res, next){
	Leadership.findByIdAndUpdate(req.params.leaderId, {
		$set: req.body
	}, {
		new: true
	}, function (err, leader) {
		if (err) throw err;
		res.json(leader);
	});
})

.delete(Verify.verifyAdmin, function(req, res, next){
	Leadership.findByIdAndRemove(req.params.leaderId, function (err, resp) {        
		if (err) throw err;
		res.json(resp);
	});
});

module.exports = leaderRouter;