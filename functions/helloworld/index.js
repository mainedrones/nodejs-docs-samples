// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START functions_helloworld_http]
const escapeHtml = require('escape-html');

// [END functions_helloworld_http]

// [START functions_helloworld_get]
/**
 * HTTP Cloud Function.
 * This function is exported by index.js, and is executed when
 * you make an HTTP request to the deployed function's endpoint.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.helloGET = (req, res) => {
  res.send('Hello Planet Earth!');
};
// [END functions_helloworld_get]

// [START functions_helloworld_http]
/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.helloHttp = (req, res) => {
  res.send(`Hello ${escapeHtml(req.query.name || req.body.name || 'World')}!`);
};
// [END functions_helloworld_http]

// [START functions_helloworld_background]
/**
 * Background Cloud Function.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.helloBackground = (data, context, callback) => {
  callback(null, `Hello ${data.name || 'World'}!`);
};
// [END functions_helloworld_background]

// [START functions_helloworld_pubsub]
/**
 * Background Cloud Function to be triggered by Pub/Sub.
 * This function is exported by index.js, and executed when
 * the trigger topic receives a message.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.helloPubSub = (data, context) => {
  const pubSubMessage = data;
  const name = pubSubMessage.data
    ? Buffer.from(pubSubMessage.data, 'base64').toString()
    : 'World';

  console.log(`Hello, ${name}!`);
};
// [END functions_helloworld_pubsub]

// [START functions_helloworld_storage]
/**
 * Background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.helloGCS = (data, context) => {
  const file = data;
  if (file.resourceState === 'not_exists') {
    console.log(`File ${file.name} deleted.`);
  } else if (file.metageneration === '1') {
    // metageneration attribute is updated on metadata changes.
    // on create value is 1
    console.log(`File ${file.name} uploaded.`);
  } else {
    console.log(`File ${file.name} metadata updated.`);
  }
};
// [END functions_helloworld_storage]

// [START functions_helloworld_storage_generic]
/**
 * Generic background Cloud Function to be triggered by Cloud Storage.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.helloGCSGeneric = (data, context, callback) => {
  const file = data;

  console.log(`  Event: ${context.eventId}`);
  console.log(`  Event Type: ${context.eventType}`);
  console.log(`  Bucket: ${file.bucket}`);
  console.log(`  File: ${file.name}`);
  console.log(`  Metageneration: ${file.metageneration}`);
  console.log(`  Created: ${file.timeCreated}`);
  console.log(`  Updated: ${file.updated}`);

  callback();
};
// [END functions_helloworld_storage_generic]

/**
 * Background Cloud Function that throws an error.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */

exports.helloError = (data, context, callback) => {
  // [START functions_helloworld_error]
  // These WILL be reported to Stackdriver Error Reporting
  console.error(new Error('I failed you'));
  console.error('I failed you', new Error('I failed you too'));
  throw new Error('I failed you'); // Will cause a cold start if not caught

  // [END functions_helloworld_error]
};

/**
 * Background Cloud Function that throws a value.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
/* eslint-disable no-throw-literal */

exports.helloError2 = (data, context, callback) => {
  // [START functions_helloworld_error]
  // These will NOT be reported to Stackdriver Error Reporting
  console.info(new Error('I failed you')); // Logging an Error object at the info level
  console.error('I failed you'); // Logging something other than an Error object
  throw 1; // Throwing something other than an Error object
  // [END functions_helloworld_error]
};
/* eslint-enable no-throw-literal */

/**
 * Background Cloud Function that returns an error.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
/* eslint-disable */
exports.helloError3 = (data, context, callback) => {
  // This will NOT be reported to Stackdriver Error Reporting
  // [START functions_helloworld_error]
  callback('I failed you');
  // [END functions_helloworld_error]
};
/* eslint-enable */

/**
 * HTTP Cloud Function that returns an error.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.helloError4 = (req, res) => {
  // This will NOT be reported to Stackdriver Error Reporting
  // [START functions_helloworld_error]
  res.status(500).send('I failed you');
  // [END functions_helloworld_error]
};

// [START functions_helloworld_template]
const path = require('path');
const pug = require('pug');

// Renders the index.pug
exports.helloTemplate = (req, res) => {
  // Render the index.pug file
  const html = pug.renderFile(path.join(__dirname, 'index.pug'));

  res.send(html).end();
};
// [END functions_helloworld_template]
