var express = require('express');
var router = express.Router();

var Store = require("jfs");
var storage = new Store("./storage.json");

var MongoClient = require('mongodb').MongoClient;
var discoverCollection;
var db = MongoClient.connect("mongodb://localhost:27017/awatch", function (err, db) {
    console.log("Connected to the database");
    discoverCollection = db.collection("discover");
});

const TMDB_NOT_FOUND = 404;
var MIN_LENGTH = 3;

var tmdb = require('moviedb')('0bac11c7565ce787aad6888729c189f6');

router.get('/search', function (req, res, next) {
    var query = req.query.query;
    if (query.length < MIN_LENGTH) {
        res.status(401).send("The query is too small");
        return;
    }
    var page = parseInt(req.query.page) || 1;
    tmdb.searchMovie({query: query, page: page}, function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        var cleanedData = {results: []};

        var length = data.results.length;
        for (var i = 0; i < length; i++) {
            result = data.results[i];
            cleanedData.results.push({
                id: result.id,
                original_title: result.original_title,
                release_date: result.release_date.substring(0, 4),
                poster_path: result.poster_path
            })
        }
        if (data.page < data.total_pages) {
            cleanedData['next_page'] = parseInt(data.page) + 1;
        }
        cleanedData['base_url'] = storage.getSync("tmdb").base_url;
        cleanedData['poster_size'] = storage.getSync("tmdb").poster_sizes[0];
        res.json(cleanedData);
    })
});


router.get('/discover', function (req, res, next) {
    var id = req.query.id;
    if (!id) {
        res.status(401).send("Provide movie id");
        return;
    }

    discoverCollection.findOne({"movieId": id}, function (err, discoverResults) {
        var cleanedData;
        if (discoverResults == null) {
            var page = parseInt(req.query.page) || 1;

            tmdb.movieSimilar({id: id, page: page}, function (err, data) {

                if (err) {
                    console.log(err);
                    res.status(err.status).send(err);
                    return;
                }

                if (data.page < data.total_pages) {
                    data['next_page'] = parseInt(data.page) + 1;
                }
                data['page'] = undefined;

                if (discoverCollection != null) {
                    discoverCollection.insert({"movieId": id, "results": data.results});
                }
                respondWithDiscoverResults(res, data);
            });
        }
        else {
            discoverResults._id = undefined;
            discoverResults.movieId = undefined;
            respondWithDiscoverResults(res, discoverResults);
        }
    });


});

function respondWithDiscoverResults(res, data) {
    data['base_url'] = storage.getSync("tmdb").base_url;
    data['poster_size'] = storage.getSync("tmdb").poster_sizes[1];
    res.json(data);
}


var schedule = require('node-schedule');

setupTmdb();
schedule.scheduleJob("0 0 */3 * *", setupTmdb);

function setupTmdb() {
    tmdb.configuration(function (err, data) {
        storage.save("tmdb", {
            base_url: data.images.base_url,
            poster_sizes: [data.images.poster_sizes[0], data.images.poster_sizes[data.images.poster_sizes.length - 2]]
        }, function (err, id) {
        });
    });
}
module.exports = router;

