//Use IIFE to create variable but only in the IIFE scope
(function(){
'use strict'; //use strict mode only in this scope

var app = {
    init = function () {
        // do something
    }
}

var route = {
    init = function (){
        // do something
    }
}

var section = {
    toggle = function(route){
        // krijgt een parameter mee en gaat hier dus iets doen met die paramter
    }
}

app.init();//start application
})();