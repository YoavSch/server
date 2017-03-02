var express = require('express'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../bin/config.json'),
    LINQ = require('node-linq').LINQ,
    mongoosePaginate = require('mongoose-paginate');

// Playlist Schema
var PlaylistSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    songs: {
        type: Array
    }
});

PlaylistSchema.methods.ModelToDto = function(){
    return {
        id              : this._id,
        name	 		: this.name,
        songs 			: this.songs
    };
};


module.exports = mongoose.model('Playlist', PlaylistSchema);