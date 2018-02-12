//Use IIFE to create variable but only in the IIFE scope
(function () {
    'use strict'; //use strict mode only in this scope

    var app = {
        init: function () {
            routes.init();
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
        }
    }

    app.init(); //start application
})();