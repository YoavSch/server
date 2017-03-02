var express = require('express'),
    router = express.Router(),
    Playlist = require('../models/playlist.model'),
    mongodb = require('mongodb');
const winston = require('winston');

/* GET /playlist. */
router.get('/', function(req, res, next) {
    winston.log('info', 'Getting all playlist');
    Playlist.find(function(err, playlists) {
        if (err) return next(err);
        winston.log('info', 'result', JSON.stringify(playlists));
        res.json(playlists);
    });
});

/* Get /playlist by id*/
router.get('/:playlist_id', function(req, res, next) {
    winston.log('info', 'Getting playlist with id ', req.params.playlist_id);
    Playlist.findById(req.params.playlist_id,function (err, playlist) {
        if (err || playlist == null) return next(err);
        winston.log('info', 'result', JSON.stringify(playlist));
        res.json(playlist.ModelToDto(playlist));
    });
});

/* POST /playlist */
router.post('/', function(req, res, next) {
    winston.log('info', 'Post new playlist ',req.body);
    Playlist.create(req.body, function (err, playlist) {
        if (err) return next(err);
        winston.log('info', 'result', JSON.stringify(playlist));
        res.json(playlist.ModelToDto(playlist));
    });
});

/* DELETE /playlist */
router.delete('/:id', function(req, res, next) {
    winston.log('info', 'Delete playlist with id ',req.params.id);
    Playlist.delete({_id: new mongodb.ObjectID(req.params.id)}, function (err, deleteResult) {
        if (err) return next(err);
        res.json(deleteResult);
    });
});

/* UPDATE /playlist */
router.put('/:playlist_id', function(req, res, next) {
    winston.log('info', 'Update Playlist with id ',req.params.playlist_id);
    Playlist.findOneAndUpdate({_id: req.params.playlist_id}, {$set:req.body}, {new: true}, function(err, playlist){
        if (err) return next(err);
        winston.log('info', 'result', JSON.stringify(playlist));
        res.json(playlist.ModelToDto(playlist));
    });
});


module.exports = router;
