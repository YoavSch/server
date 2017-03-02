var express = require('express'),
 	mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
 	config = require('../bin/config.json'),
 	user = require('./user.model'),
	LINQ = require('node-linq').LINQ;


// Complain Schema
var ComplainSchema = new Schema({
	userId: String,
	parentId : String,
	type : {
		type : String,
		enum: ['Food', 'Car']
	},
	message : {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

ComplainSchema.methods.FillComplainsData = function (err, temp) {
	var arrayLength = this.length;
	var index = 0,
		temp = [];
	new LINQ(this).Select(function(complain) {
		user.findById(complain.userId, function(err, user) {
			index++;
			temp.push(complain.ModelToDto(user));
			if (index == arrayLength) {
				cb(null, temp);
			}
		});
	});
};

ComplainSchema.methods.ModelToDto = function(user){
	return {
		id 					: this.id,
		type 				: this.type,
		message 			: this.message,
		user 			: user.ModelToBaseDto()
	};
};

module.exports = mongoose.model('Complain', ComplainSchema);