# @akitabox/node-recaptcha

@akitabox/node-recaptcha renders and verifies [reCAPTCHA](https://google.com/recaptcha) captchas with support for node servers behind proxies.

**NOTE**: This release currently only supports reCAPTCHA [version 2](https://developers.google.com/recaptcha/intro).

## Installation

Via npm:

    $ npm install @akitabox/node-recaptcha

## Setup

Before you can use this module, you must visit http://www.google.com/recaptcha
to request a public and private API key for your domain.

### Optional Use Behind Proxy

Export the environment variable `HTTPS_PROXY` as described [here](https://github.com/request/request#proxies).

## Running the Tests

To run the tests for this module, you will first need to install
[nodeunit](http://github.com/caolan/nodeunit).  Then, simply run:

    $ npm test

## Example Using [Express](http://www.expressjs.com)

Reference examples folder