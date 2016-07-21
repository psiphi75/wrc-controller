/*********************************************************************
 *                                                                   *
 *   Copyright 2016 Simon M. Werner                                  *
 *                                                                   *
 *   Licensed to the Apache Software Foundation (ASF) under one      *
 *   or more contributor license agreements.  See the NOTICE file    *
 *   distributed with this work for additional information           *
 *   regarding copyright ownership.  The ASF licenses this file      *
 *   to you under the Apache License, Version 2.0 (the               *
 *   'License'); you may not use this file except in compliance      *
 *   with the License.  You may obtain a copy of the License at      *
 *                                                                   *
 *      http://www.apache.org/licenses/LICENSE-2.0                   *
 *                                                                   *
 *   Unless required by applicable law or agreed to in writing,      *
 *   software distributed under the License is distributed on an     *
 *   'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY          *
 *   KIND, either express or implied.  See the License for the       *
 *   specific language governing permissions and limitations         *
 *   under the License.                                              *
 *                                                                   *
 *********************************************************************/

'use strict';

var nodeStatic = require('node-static');

function WRCController(port, log) {
    port = port || 8888;
    log = log || console.log;

    //
    // Enable Cross Origin Requests
    //
    var options = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    var fileServer = new nodeStatic.Server(__dirname + '/public', options);

    require('http').createServer(function (request, response) {
        request.addListener('end', function () {
            //
            // Serve files!
            //
            fileServer.serve(request, response)
            .addListener('error', function (err) {
                log('Error serving ' + request.url + ' - ' + err.message);
            })
            .addListener('success', function (obj) {
                log(request.url + ' (' + obj.status + ')', obj.headers.Date);
            });
        }).resume();

    }).listen(port);

    // TODO:  This prints out "Point your mobile phone to http://[IP THIS COMPUTER]:8888" - we should lookup the IP address, but there may be a few.
    console.log('Point your mobile phone to http://[IP THIS COMPUTER]:' + port);
}

module.exports = WRCController;
