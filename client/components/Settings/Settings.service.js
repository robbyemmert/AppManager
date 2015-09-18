'use strict';

angular.module('appManagerApp')
.service('Settings', function () {
    // Use this service to configure supported languages.
    this.keys = [
        {
            name: "Android Key",
            key: 'android',
            field: 'android'
        },
        {
            name: "iOS Key",
            key: 'ios',
            field: 'en'
        }
    ];

    this.languages = [
        {
            name: "English",
            key: 'en'
        },
        {
            name: "Spanish",
            key: 'es'
        },
        {
            name: "Portuguese",
            key: 'pt'
        },
        {
            name: "Indonesian",
            key: 'id'
        },
        {
            name: "Thai",
            key: 'th'
        },
        {
            name: "Japanese",
            key: 'ja'
        },
        {
            name: "Chinese (Simplified)",
            key: 'zh-hans',
            androidKey: 'zh-rCN'
        },
        {
            name: "Chinese (Traditional)",
            key: 'zh-hant',
            androidKey: 'zh-rTW'
        },
        {
            name: "French",
            key: 'fr'
        },
        {
            name: "Dutch",
            key: 'nl'
        },
        {
            name: "German",
            key: 'de'
        }
    ];

    this.mainLanguage = "en";

    this.getKeyByName = function(name){
        for (var index in this.keys) {
            if (this.keys.hasOwnProperty(index)) {
                var key = this.keys[index];
                if (key.name == name) {
                    return key;
                }
            }
        }

        return false;
    }

    this.getKeyByKey = function(key){
        for (var index in this.keys) {
            if (this.keys.hasOwnProperty(index)) {
                var keyObj = this.keys[index];
                if (keyObj.key == key) {
                    return keyObj;
                }
            }
        }

        return false;
    }

    this.getLanguageByName = function(name){
        for (var index in this.languages) {
            if (this.languages.hasOwnProperty(index)) {
                var language = this.languages[index];
                if (language.name == name) {
                    return language;
                }
            }
        }

        return false;
    }

    this.getLanguageByKey = function(key){
        for (var index in this.languages) {
            if (this.languages.hasOwnProperty(index)) {
                var language = this.languages[index];
                if (language.key == key) {
                    return language;
                }
            }
        }

        return false;
    }
});
