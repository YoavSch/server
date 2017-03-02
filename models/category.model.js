var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../bin/config.json'),
    user = require('./user.model'),
    LINQ = require('node-linq').LINQ,
    mongoosePaginate = require('mongoose-paginate');


// Category Schema
var CategorySchema = new Schema({
    userId: {
        type :String,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

CategorySchema.methods.FillComplainsData = function (err, temp) {
    var arrayLength = this.length;
    var index = 0,
        temp = [];
    new LINQ(this).Select(function(category) {
        user.findById(category.userId, function(err, user) {
            index++;
            temp.push(category.ModelToDto(user));
            if (index == arrayLength) {
                cb(null, temp);
            }
        });
    });
};

CategorySchema.methods.ModelToDto = function(user){
    return {
        id 					: this.id,
        name 				: this.name,
        user 			    : user.ModelToBaseDto()
    };
};
CategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Category', CategorySchema);