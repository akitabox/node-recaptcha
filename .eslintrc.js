module.exports = {
    "env" : {
        "browser" : true,
        "es6"     : true,
        "jquery"  : true,
        "mocha"   : true,
        "mongo"   : true,
        "node"    : true
    },
    "globals" : {
        "define" : true
    },
    "extends" : [
        "google"
    ],
    "rules" : {
        "camelcase" : "off",
        "indent": [
            "error", 4, {
                "SwitchCase" : 1
            }
        ],
        "key-spacing" : [
            "error", {
                "beforeColon" : true,
                "afterColon"  : true,
                "align"       : "colon"
            }
        ],
        "max-len" : [
            "warn", {
                "code"                   : 120,
                "ignoreTrailingComments" : true,
                "ignoreUrls"             : true,
                "tabWidth"               : 4
            }
        ],
        "no-multi-spaces" : [
            "error", {
                "exceptions" : {
                    "VariableDeclarator" : true
                }
            }
        ],
        "object-curly-spacing" : [
            "error", "always"
        ],
        "space-before-function-paren" : [
            "error", {
                "anonymous" : "always",
                "named"     : "never"
            }
        ],
        "valid-jsdoc" : [
            "warn", {
                "requireReturn"     : false,
                "requireReturnType" : false
            }
        ]
    }
};