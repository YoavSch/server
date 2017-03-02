var express = require('express'),
    router = express.Router(),
    Album = require('../models/album.model'),
    Song = require('../models/song.model'),
    LINQ = require('node-linq').LINQ,
    Q = require("q");
const winston = require('winston');

/* GET /album listing. */
router.get('/', function(req, res, next) {
    winston.log('info', 'Getting all albums');
    Album.find(function(err, albums) {
        if (err) return next(err);
        getAllAlbums(albums).then(function(result){
            res.json(result);
        });

    });
});

function getAllAlbums(albums) {
    var deferred = Q.defer();
    winston.log('info', 'Getting full albums details');
    var albumsLength = albums.length;
    if(albumsLength === 0){
        winston.log('war', 'No albums yet');
        res.json(albums);
    }
    var albumsIndex = 0;
    new LINQ(albums).Select(function(album){
        albumsIndex++;
        var songLength = album.songs.length;
        var fullSongsDetails = [];
        if(songLength !== 0){
             var index = 0;
             new LINQ(album.songs).Select(function(songId) {
                Song.findById(songId, function(err, song) {
                    index++;
                    if(song !== null){
                        fullSongsDetails.push(song.ModelToDto(song));
                        if (index == songLength) {
                            winston.log('info', 'adding songs to album', JSON.stringify(fullSongsDetails));
                            album.songs = fullSongsDetails;
                        }
                    }

                    if(albumsIndex == albumsLength && index == songLength){
                        winston.log('info', 'result', JSON.stringify(albums));
                        deferred.resolve(albums);
                    }
                });
             });
        }else {
          album = album.ModelToDto(album);
        }
    });
    return deferred.promise;
}

router.get('/:album_id', function(req, res, next) {
    winston.log('info', 'Get album with id', req.params.album_id);
    Album.findOne({ _id : req.params.album_id},function (err, album) {
        if (err || album == null) return next(err);
        var fullSongsDetails = [];
        var index = 0;
        var arrayLength =  album.songs.length;

        new LINQ(album.songs).Select(function(songId) {
            Song.findById(songId, function(err, song) {
                index++;
                winston.log('info', 'song found', err);
                    fullSongsDetails.push(song.ModelToDto(song));
                    if (index == arrayLength) {
                        album.songs = fullSongsDetails;
                        winston.log('info', 'result', JSON.stringify(album));
                        res.json(album.ModelToDto(album));
                    }

            });
        });
    });
});

/* POST /album */
router.post('/', function(req, res, next) {
    winston.log('info', 'Post new album', req.body);
    Album.create(req.body, function (err, album) {
        if (err) return next(err);
        winston.log('info', 'result', JSON.stringify(album));
        res.json(album.ModelToDto(album));
    });
});

/* UPDATE /album */
router.put('/:album_id', function(req, res, next) {
    winston.log('info', 'Update album with id', req.param.album_id);
    Album.findOneAndUpdate({_id: req.params.album_id}, {$set:req.body}, {new: true}, function(err, album){
        if (err) return next(err);
        winston.log('info', 'result', JSON.stringify(album));
        res.json(album.ModelToDto(album));
    });
});


function getAlbulFullDetails(album){
    var index = 0,
        fullSongsDetails = [],
        numberOfsongsLength = album.songs.length;

    new LINQ(album.songs).Select(function(songId) {
            Song.findById(songId, function(err, song) {
                index++;
                fullSongsDetails.push(song.ModelToDto(song));
                if (index == numberOfsongsLength) {
                    album.songs = fullSongsDetails;
                    return album.ModelToDto(album);
                }
            });
        });
}
module.exports = router;
