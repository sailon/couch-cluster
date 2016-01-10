'use strict';

var express = require('express');
var router = express.Router();
var couchbase = require('couchbase');
var cluster = new couchbase.Cluster('couchbase://127.0.0.1');
var bucket = cluster.openBucket('assets');

// Setup Query singleton
var N1qlQuery = couchbase.N1qlQuery;

/**
 * Cleans input for N1QL queries. Currently only removes spaces preventing basic injection attacks.
 * @param {string} input
 * @returns {string}
 */
function sanitize (input) {
	return input.replace(/ /g, '');
}

/**
 * Validates a document URI. Must exist and match the pattern.
 * @param {string} uri
 * @returns {boolean}
 */
function isValidUri (uri) {
	var uri = sanitize(uri);
	return (uri !== null && uri !== 'undefined' && uri.match(/\w{3,}\:\/\/\w{2,}\/\w*/g));
}

/**
 * Builds a N1QL query that finds a specific document given a URI.
 * @param {string} uri
 * @returns {object}
 */
function docQuery (uri) {
	var str = 'SELECT uri, name, note FROM `assets` WHERE assets.uri="' + uri + '"';
	return N1qlQuery.fromString(str);
}

/*
 * List assets
 * GET /api/assets?size={size}&page={page}&tag={tag1,tag2}
 */
router.get('/', function (req, res) {

	// Setting up pagination options with defaults
	var options = {
		perPage: parseInt(req.query.size) || 10,
		page: parseInt(req.query.page) || 1
	};

	// Building the query string
	var str = 'SELECT uri, name, note FROM `assets` ';
	var pagination = (' LIMIT ' + options.perPage + ' OFFSET ' + (options.page * options.perPage - options.perPage));
	str += pagination;

	// Construct the query object
	var query = N1qlQuery.fromString(str);

	// Execute query against Couchbase
	bucket.query(query,[],function(err,assets){
		if (!err) {
      return res.send(assets);
    } else {
      return console.log(err);
    }
	});

});

/*
 * Add an asset
 * POST /api/assets/
 */
router.post('/', function (req, res) {

	var uri = req.body.uri;

	if (!isValidUri(uri)) return res.send('400, "uri" is a required field and must be well formed.');

	// Create or update an asset document
	bucket.upsert(req.body.uri,req.body,function(err,assets){
		if (!err) {
      return res.sendStatus(201);
    } else {
      return console.log(err);
    }
	});
});

/*
 * Remove an asset
 * DELETE /api/assets/
 */
router.delete('/', function (req, res) {

	var uri = req.body.uri;

	if (!isValidUri(uri)) return res.send('400, "uri" is a required field and must be well formed.');

	// Build the query to find the document
	var query = docQuery(uri);

	// Find the document to ensure it exists
	bucket.query(query, [], function (err, assets){
		var asset = assets[0]; // Query returns array, grabbing the first result

		if (!err && asset && asset !== 'undefined') {

      // Delete the asset
			bucket.remove(req.body.uri,function(err,assets){
				if (!err) {
		      return res.sendStatus(204);
		    } else {
		      return console.log(err);
		    }
			});

    } else { // Asset does not exist
      return res.sendStatus(404);
    }
	});

});

/*
 * Add a note to an asset
 * PUT /api/assets/
 */
router.put('/', function (req, res) {

	var uri = sanitize(req.body.uri);
	var note = req.body.note;

	if (!isValidUri(uri)) return res.send('400, "uri" is a required field and must be well-formed.');
	if (!note) return res.send('400, "note" is a required field.');

	// Build the query to find the document
	var query = docQuery(uri);

	// Find the document to update
	bucket.query(query, [], function (err, assets){
		var asset = assets[0]; // Query returns array, grabbing the first result

		if (!err && asset && asset !== 'undefined') {

			// Update the note field with the new submission
      asset.note = note;

      // Replace the old document with the updated document
      bucket.replace(uri, asset, function (err) {
      	if (!err) {
		      return res.sendStatus(200);
		    } else {
		      return console.log(err);
		    }
      });

    } else { // Asset does not exist
      return res.sendStatus(404);
    }
	});
});

module.exports = router;
