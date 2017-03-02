var express = require('express'),
 	mongoose = require('mongoose'),
 	Schema = mongoose.Schema,
 	bcrypt = require('bcrypt-nodejs'),
 	config = require('../bin/config.json'),
 	jwt    = require('jsonwebtoken');

// user schema
var UserSchema = new Schema({
	name: String,
	email : String,
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		}
	},
	password: {
		type: String,
		required: true
	},
	created_at: {
		type: Date,
		default: Date.now
	},
	updated_at: {
		type: Date,
		default: Date.now
	}
});

// hash the password before the user is saved
UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) return next();
	bcrypt.hash(user.password, null, null, function(err, hash) {
		if (err) return next(err);
		user.password = hash;
		next();
	});
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.ModelToBaseDto = function(){
	return {
		id 					: this.id,
		username	 	: this.username,
		name 				: this.name,
		created_at 	: this.created_at,
		updated_at 	: this.updated_at
	};
};

UserSchema.methods.ModelToDto = function(){
	return {
		id 					: this.id,
		username	 		: this.username,
		name 				: this.name,
		created_at 			: this.created_at,
		updated_at 			: this.updated_at
	};
};

module.exports = mongoose.model('User', UserSchema);