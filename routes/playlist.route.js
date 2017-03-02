var express = require('express'),
    router = express.Router(),
    Playlist = require('../models/playlist.model'),
    mongodb = require('mongodb'),
    Song = require('../models/song.model'),
    LINQ = require('node-linq').LINQ,
    Q = require("q");
const winston = require('winston');

/* GET /playlist. */
router.get('/', function(req, res, next) {
    winston.log('info', 'Getting all playlist');
    Playlist.find(function(err, playlists) {
        if (err) return next(err);
        getAllPlaylist(playlists).then(function(result){
            res.json(result);
        });
    });
});

/* Get /playlist by id*/
router.get('/:playlist_id', function(req, res, next) {
    Playlist.findOne({ _id : req.params.playlist_id},function (err, playlist) {
        if (err || playlist == null) return next(err);
        var fullSongsDetails = [];
        var index = 0;
        var arrayLength =  playlist.songs.length;

        new LINQ(playlist.songs).Select(function(songId) {
            Song.findById(songId, function(err, song) {
                index++;
                winston.log('info', 'song found', err);
                    fullSongsDetails.push(song.ModelToDto(song));
                    if (index == arrayLength) {
                        playlist.songs = fullSongsDetails;
                        winston.log('info', 'result', JSON.stringify(playlist));
                        res.json(playlist.ModelToDto(playlist));
                    }

            });
        });
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

function getAllPlaylist(playlists) {
    var deferred = Q.defer();
    winston.log('info', 'Getting full playlist details');
    var playlistsLength = playlists.length;
    if(playlistsLength === 0){
        winston.log('war', 'No playlists yet');
        res.json(playlists);
    }
    var playlistsIndex = 0;
    new LINQ(playlists).Select(function(playlist){
        playlistsIndex++;
        var songLength = playlist.songs.length;
        var fullSongsDetails = [];
        if(songLength !== 0){
             var index = 0;
             new LINQ(playlist.songs).Select(function(songId) {
                Song.findById(songId, function(err, song) {
                    index++;
                    if(song !== null){
                        fullSongsDetails.push(song.ModelToDto(song));
                        if (index == songLength) {
                            winston.log('info', 'adding songs to playlist', JSON.stringify(fullSongsDetails));
                            playlist.songs = fullSongsDetails;
                        }
                    }

                    if(playlistsIndex == playlistsLength && index == songLength){
                        winston.log('info', 'result', JSON.stringify(playlists));
                        deferred.resolve(playlists);
                    }
                });
             });
        }else {
          playlist = playlist.ModelToDto(playlist);
        }
    });
    return deferred.promise;
}


module.exports = router;
