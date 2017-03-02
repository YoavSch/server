var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../bin/config.json'),
    song = require('./song.model'),
    LINQ = require('node-linq').LINQ,
    mongoosePaginate = require('mongoose-paginate');
    
// Album Schema
var AlbumSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    songs : {
        type : Array
    }
});

AlbumSchema.methods.ModelToDto = function(){
    return {
        id              : this._id,
        name	 		: this.name,
        songs 			: this.songs
    };
};

module.exports = mongoose.model('Album', AlbumSchema);