'use strict';

var frisby = require('frisby');

frisby.create('Create an asset')
    .post('http://couch1.vagrant:3000/api/assets', {
		"name": "Test User",
		"uri": "myorg://users/test-user"
    }, {json: true})
    .expectStatus(201)
    .after(function (err, res, body) {

    	frisby.create('Add a note to an asset')
		    .put('http://couch1.vagrant:3000/api/assets', {
					"uri": "myorg://users/test-user",
					"note": "This is a note for Test User!"
		    }, {json: true})
		    .expectStatus(200)
		.toss();
    })
.toss();

frisby.create('Create an invalid asset')
    .post('http://couch1.vagrant:3000/api/assets', {
		"name": "BooK of Life",
		"uri": "urn:books/bookoflife"
    }, {json: true})
    .expectStatus(400)
.toss();

frisby.create('Add a note to a non-existent asset')
    .put('http://couch1.vagrant:3000/api/assets', {
		"note": "Compnay Photo",
		"uri": "myorg://images/company-photo"
    }, {json: true})
    .expectStatus(404)
.toss();