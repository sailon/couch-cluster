#!/bin/bash

npm install -g loadtest

loadtest -n 3000 -c 12  http://couch1.vagrant:3000/api/assets