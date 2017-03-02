var express = require('express'),
    router = express.Router(),
    Playlist = require('../models/playlist.model'),
    Song = require('../models/song.model'),
    Album = require('../models/album.model'),
    LINQ = require('node-linq').LINQ,
    mongodb = require('mongodb');
    dataService = require('../services/data.service'),
    Q = require("q");
const winston = require('winston');




/*************************
      Clear all DB
  Albums/Songs/Playlist
 **************************/


function deleteRecordByIdAndType(object, songId) {
    object.remove({_id: songId}, function(err, result) {
        winston.log('info', 'delete record with id = ', songId );
    });
}

function deleteRecordsByType(typeOfRecord,arrayOfRecords){
    var deferred = Q.defer();
    var index = 0;
    if(arrayOfRecords.length === 0){
        deferred.resolve(arrayOfRecords);
    }
    new LINQ(arrayOfRecords).Select(function(record) {
        deleteRecordByIdAndType(typeOfRecord, record._id)
        index++;
        if(arrayOfRecords === index){
            deferred.resolve(arrayOfRecords);
        }
        
    });
    return deferred.promise;
}
/* GET /delete all songs. */
router.get('/deleteAllSongs', function(req, res, next) {
    winston.log('info', 'Delete all songs');
    Song.find(function(err, songs) {
        if (err) return next(err);
        deleteRecordsByType(Song,songs);
        res.json({});
    });
});

/* GET /delete all albums. */
router.get('/deleteAllAlbums', function(req, res, next) {
    winston.log('info', 'Delete all albums');
    Album.find(function(err, songs) {
        if (err) return next(err);
        deleteRecordsByType(Album,songs);
        res.json({});
    });
});

/* GET /delete all playlists. */
router.get('/deleteAllPlayList', function(req, res, next) {
    winston.log('info', 'Delete all playlists');
    Playlist.find(function(err, songs) {
        if (err) return next(err);
        deleteRecordsByType(Playlist,songs);
        res.json({});
    });
});

/* GET /delete all DB. */
router.get('/deleteAllDB', function(req, res, next) {
    winston.log('info', 'Delete all DB');
    Song.find(function(err, songs) { 
        deleteRecordsByType(Song,songs).then(function(done){
            Album.find(function(err, albums) { 
                deleteRecordsByType(Album,albums).then(function(done){
                    Playlist.find(function(err, playlist) { 
                        deleteRecordsByType(Playlist,playlist).then(function(done){
                            res.json({});
                        });
                    });
                });
            });
        });
    });
    
    
    
});




/* GET /initilize DB. */
router.get('/start', function(req, res, next) {
    winston.log('info', 'Start initilize DB');
    var albumsData = dataService.getAllAlbumsData();
    var index = 0;
    new LINQ(albumsData).Select(function(albumData) {
        index++;
        var songsIds = [];
        var albumRecord = {
            name : albumData.name,
            songs : songsIds
        };
        Album.create(albumRecord, function (err, album) {
            winston.log('info', 'Post new album successfully', albumRecord);
            if (err) return next(err);
            new LINQ(albumData.songs).Select(function(record) {
                var songRecord = {
                    albumId : album._id,
                    name    : record.name,
                    min     : record.min,
                    sec     : record.sec
                };
                Song.create(songRecord, function (err, song) {
                    if (err) return next(err);
                    album.songs.push(song._id);
                    winston.log('info', 'New Song created with id', song._id);

                    if(album.songs.length === albumData.songs.length){
                        winston.log('info', 'album with all songs was updated', JSON.stringify(album));
                        Album.findOneAndUpdate({_id: album._id}, {$set:album}, {new: true}, function(err, album){
                            if (err) return next(err);
                            if(albumsData.length === index){
                                res.json({});
                            }
                        });
                    }
                });
            });
        });
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
        res.json({});

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