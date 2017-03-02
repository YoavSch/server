var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../bin/config.json'),
    LINQ = require('node-linq').LINQ,
    mongoosePaginate = require('mongoose-paginate');
    
// Song Schema
var SongSchema = new Schema({
    albumId: {
        type :String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    min : {
        type : Number,
        required : true
    },
    sec : {
        type : Number,
        required : true
    }
});

SongSchema.methods.ModelToDto = function(){
    return {
        id              : this._id,
        name	 		: this.name,
        min 			: this.min,
        sec 			: this.sec
    };
};


module.exports = mongoose.model('Song', SongSchema);