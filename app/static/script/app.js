//Use IIFE to create variable but only in the IIFE scope
(function () {
    'use strict'; //use strict mode only in this scope

    var app = {
        init: function () {
            routes.init();


            let xhr = new XMLHttpRequest();
            let url = "https://api.coinmarketcap.com/v1/ticker/";
            xhr.open("GET", url, true);
            xhr.send();
            section.insert(xhr.response)
            console.log(xhr.response);
        }
    }

    var routes = {
        init: function () {
            window.addEventListener('hashchange', function () {
                let hash = location.hash; //get hash without #
                section.toggle(hash)
            });
        }
    }

    var section = {
        toggle: function (route) {

            //remove all active class
            var section = document.querySelectorAll('section');
            section.forEach(function (i) {
                i.classList.remove('active');
            });

            //Add active class to the page-link that you've clicked
            document.querySelector(route).classList.add('active');
        },

        insert: function(element){
            console.log(element)
        }
    }

    app.init(); //start application
})();