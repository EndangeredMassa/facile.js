
Facile
===

[![Build Status](https://secure.travis-ci.org/lawlesst/bibjsontools.png?branch=master)](http://travis-ci.org/lawlesst/bibjsontools)

Convention-based template engine that depends on jQuery or zepto.

Features
===

1. maps string values to ids (or class if id not found) that match keys
1. maps array values to classes that match keys
1. removes elements with null values that have ids (or classes) that match keys
1. maps object values to allow attribute binding in addition to content binding
1. maps arrays of object values to allow nested loop binding

See tests for a more complete explanation. 

Running the tests
===
1. Install node, npm, coffee-script
1. ./coffee   # to watch/recompile coffee
1. node test  # run jasmine server
1. visit http://localhost:5000

