/*!
 * node-recaptcha
 * Copyright(c) 2010 Michael Hampton <mirhampt+github@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var http        = require('http'),
    querystring = require('querystring');

/**
 * Constants.
 */

var API_HOST      = 'www.google.com',
    API_END_POINT = '/recaptcha/api/verify',
    SCRIPT_SRC    = 'http://' + API_HOST + '/recaptcha/api/challenge',
    NOSCRIPT_SRC  = 'http://' + API_HOST + '/recaptcha/api/noscript';

/**
 * Initialize Recaptcha with given `public_key`, `private_key` and optionally
 * `data`.
 *
 * The `data` argument should have the following keys and values:
 *
 *   remoteip:  The IP of the client who submitted the form.
 *   challenge: The value of `recaptcha_challenge_field` from the Recaptcha
 *              form.
 *   response:  The value of `recaptcha_response_field` from the Recaptcha
 *              form.
 *
 * @param {String} public_key Your Recaptcha public key.
 * @param {String} private_key Your Recaptcha private key.
 * @param {Object} data The Recaptcha data to be verified.  See above for
 *                      format.  (optional)
 * @api public
 */

var Recaptcha = exports.Recaptcha = function Recaptcha(public_key, private_key, data) {
    this.public_key = public_key;
    this.private_key = private_key;
    this.data = data;

    return this;
}

/**
 * Render the Recaptcha fields as HTML.
 *
 * If there was an error during `verify` and the selected Recaptcha theme
 * supports it, it will be displayed.
 *
 * @api public
 */

Recaptcha.prototype.toHTML = function() {
    var query_string = 'k=' + this.public_key;
    if (this.error_code) {
        query_string += '&error=' + this.error_code;
    }

    var script_src = SCRIPT_SRC + '?' + query_string;
    var noscript_src = NOSCRIPT_SRC + '?' + query_string;

    return '<script type="text/javascript" src="' + script_src + '"></script>' +
           '<noscript><iframe src="' + noscript_src + '" height="300" width="500" ' +
           'frameborder="0"></iframe><br><textarea name="recaptcha_challenge_field" ' +
           'rows="3" cols="40"></textarea><input type="hidden" ' +
           'name="recaptcha_response_field" value="manual_challenge"></noscript>';
};

/**
 * Verify the Recaptcha response.
 *
 * Example usage:
 *
 *     var recaptcha = new Recaptcha('PUBLIC_KEY', 'PRIVATE_KEY', data);
 *     recaptcha.verify(function(success, error_code) {
 *         if (success) {
 *             // data was valid.  Continue onward.
 *         }
 *         else {
 *             // data was invalid, redisplay the form using
 *             // recaptcha.toHTML().
 *         }
 *     });
 *
 * @param {Function} callback
 * @api public
 */

Recaptcha.prototype.verify = function(callback) {
    var self = this;

    // See if we can declare this invalid without even contacting Recaptcha.
    if (typeof(this.data) === 'undefined') {
        this.error_code = 'verify-params-incorrect';
        return callback(false, 'verify-params-incorrect');
    }
    if (!('remoteip' in this.data &&
          'challenge' in this.data &&
          'response' in this.data))
    {
        this.error_code = 'verify-params-incorrect';
        return callback(false, 'verify-params-incorrect');
    }
    if (this.data.response === '') {
        this.error_code = 'incorrect-captcha-sol';
        return callback(false, 'incorrect-captcha-sol');
    }

    // Add the private_key to the request.
    this.data['privatekey'] = this.private_key;
    var data_qs = querystring.stringify(this.data);

    var recaptcha = http.createClient(80, API_HOST);
    var request = recaptcha.request('POST', API_END_POINT, {
        host:             API_HOST,
        'Content-Length': data_qs.length,
        'Content-Type':   'application/x-www-form-urlencoded'
    });

    request.on('response', function(response) {
        var body = '';
        response.on('data', function(chunk) {
            body += chunk;
        });
        response.on('end', function() {
            var success, error_code;
            parts = body.split('\n');
            success = parts[0];
            error_code = parts[1];
            if (success !== 'true') {
                self.error_code = error_code;
            }
            return callback(success === 'true', error_code);
        });
    });

    request.write(data_qs, 'utf8');
    request.end();
};