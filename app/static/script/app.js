//Use IIFE to create variable but only in the IIFE scope
(function () {
    'use strict'; //use strict mode only in this scope

    var app = {
        init: function () {
            let xhr = new XMLHttpRequest();
            let url = "https://api.coinmarketcap.com/v1/ticker/";
            xhr.open("GET", url, true);
            xhr.onload = function (e) {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data = JSON.parse(xhr.responseText);
                        routes.init(data); //init route
                    } else {
                        console.error(xhr.statusText);
                    }
                }
            };
            xhr.send();
        }
    }

    var routes = {
        init: function (data) {
            this.routie(data);
        },
        routie(data) {
            routie({
                '': function () { //start page
                    section.insert(data);
                },
                '/detail/*': function () {
                    section.insert(data);
                }
            });
        }
    }

    var section = {
        toggle: function (route) {

            //remove all active class
            let section = document.querySelectorAll('section');
            section.forEach(function (i) {
                i.classList.remove('active');
            });

            //Add active class to the page-link that you've clicked
            document.querySelector(route).classList.add('active');
        },

        insert: function (data) {
            let dataCoin = data.map(function (i) { //Map function thanks to Keving Wang
                return {
                    id: i.id,
                    rank: i.rank,
                    name: i.name,
                    price: i.price_usd,
                    percent_change_24h: i.percent_change_24h
                }
            });

            let directives = {
                coin_id: {
                    href: function (params) {
                        return "index.html/detail/" + this.id
                    },
                    percent_change_24h: {
                        class: function (params) {
                            return this.percent_change_24h
                        }
                    }
                }
            };

            Transparency.render(document.querySelector('#start div'), dataCoin, directives);
        }
    }

    app.init(); //start application
})();