var express = require('express'),
    router = express.Router(),
    Song = require('../models/song.model'),
    Album = require('../models/album.model'),
    LINQ = require('node-linq').LINQ,
    mongodb = require('mongodb');
    Q = require("q");
const winston = require('winston');

/* GET /song listing. */
router.get('/', function(req, res, next) {
    winston.log('info', 'Getting all songs');
    Song.find(function(err, songs) {
        if (err) return next(err);
        winston.log('info', 'result', JSON.stringify(songs));
        res.json(songs);
    });
});

router.get('/:song_id', function(req, res, next) {
    winston.log('info', 'Getting song with id ', req.params.song_id);
    Song.findById(req.params.song_id,function (err, song) {
        if (err || song == null) return next(err);
        winston.log('info', 'result', JSON.stringify(song));
        res.json(song.ModelToDto(song));
    });
});

/* POST /song */
router.post('/', function(req, res, next) {
    winston.log('info', 'Post new song ',req.body);
    Song.create(req.body, function (err, song) {
        if (err) return next(err);
        updateAlbumSong(req.body.albumId,song._id);
        winston.log('info', 'result', JSON.stringify(song));
        res.json(song.ModelToDto(song));
    });
});

/* DELETE /song */
router.delete('/:id', function(req, res, next) {
    winston.log('info', 'Delete song with id ',req.params.id);
    Song.delete({_id: new mongodb.ObjectID(req.params.id)}, function (err, deleteResult) {
        if (err) return next(err);
        res.json(deleteResult);
    });
});

/* UPDATE /song */
/*
    HEADERS
    you must add Content-Type : application/json
 */
router.put('/:song_id', function(req, res, next) {
    winston.log('info', 'Update song with id ',req.params.song_id);
    Song.findOneAndUpdate({_id: req.params.song_id}, {$set:req.body}, {new: true}, function(err, song){
        if (err) return next(err);
        updateAlbumSong(req.body.albumId,req.params.song_id);
        winston.log('info', 'result', JSON.stringify(song));
        res.json(song.ModelToDto(song));
    });
});




function  updateAlbumSong(albumId , songId) {
    if(albumId !== null && albumId.length > 0){
    }else {
        winston.log('warn', 'wrong parameters!!!! ');
    }
    Album.findById(albumId,function (err, album) {
        if(!songExistInAlbum(album, songId)){
            album.songs.push(songId);
            Album.findOneAndUpdate({_id: albumId}, {$set:album}, {new: true}, function(err, album){ });
        }
        if (err || album == null) return next(err);
    });
}

function songExistInAlbum(album, songId){
    var songs = album.songs.filter(function(id){
        if(id === songId){
            return id;
        }
    });
    return songs.length > 0;
}

module.exports = router;
