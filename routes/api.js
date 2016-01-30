var express = require('express');
var router = express.Router();

var Store = require("jfs");
var db = new Store("./db.json");

var tmdb = require('tmdbv3').init('0bac11c7565ce787aad6888729c189f6');
var MIN_LENGTH = 3;

router.get('/search', function (req, res, next) {
    var query = req.query.query;
    if (query.length < MIN_LENGTH) {
        res.status(401).send("The query is too small");
        return;
    }
    var page = parseInt(req.query.page) || 1;
    tmdb.search.movie(query, page, function (err, data) {
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
        cleanedData['base_url'] = db.getSync("tmdb").base_url;
        cleanedData['poster_size'] = db.getSync("tmdb").poster_sizes[0];
        res.json(cleanedData);
    })
});


router.get('/discover', function (req, res, next) {
    var id = req.query.id;
    if (!id) {
        res.status(401).send("Provide movie id");
        return;
    }
    var page = parseInt(req.query.page) || 1;

    tmdb.movie.similar(id, page, function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (data.page < data.total_pages) {
            data['next_page'] = parseInt(data.page) + 1;
            data['total_pages'] = undefined;
            data['total_results'] = undefined;
            data['page'] = undefined;
        }

        res.json(data)
    });
});


var schedule = require('node-schedule');

setupTmdb();
schedule.scheduleJob("0 0 */3 * *", setupTmdb);

function setupTmdb() {
    tmdb.configuration(function (err, data) {
        //console.log(data.images.base_url);
        db.save("tmdb", {
            base_url: data.images.base_url,
            poster_sizes: [data.images.poster_sizes[0], data.images.poster_sizes[data.images.poster_sizes.length - 2]]
        }, function (err, id) {
        });
    });
}
module.exports = router;

