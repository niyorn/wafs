//Use IIFE to create variable but only in the IIFE scope
(function () {
    'use strict'; //use strict mode only in this scope

    var app = {
        init: function () {
            routes.init();
        }
    }

    var api = {
        init: function () {
            /*Created promise syntax with the help of Kevin Wang(github: Kyunwang) and stackoverflow:
            https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr*/
            let requestNetwork = new Promise(function (resolve, reject) {
                let xhr = new XMLHttpRequest();
                let url = "https://api.coinmarketcap.com/v1/ticker/";
                xhr.open("GET", url, true); //create a async request
                xhr.onload = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) { //change hereree
                            resolve(xhr.responseText);
                        } else {
                            reject({
                                status: this.status
                            });
                        }
                    }
                };

                //Extra error handle if the onload doesn't work
                xhr.onerror = function () {
                    reject({
                        status: this.status,
                    });
                }
                //send request
                xhr.send();
            });

            //handle promise
            requestNetwork
                .then(function (data) {
                    let dataJson = JSON.parse(data);
                    helper.storage = dataJson;
                    section.init(dataJson);
                })
                .catch(function (err) {
                    location.href = '#error/' + err.status //change to error hash
                });
        }
    }

    //Handel the route 
    var routes = {
        init() {
            routie({
                '': function () { //start page
                    section.loading.set();
                    api.init();
                },
                'detail/:id': function (id) { //load the detail page
                    let data = helper.storage;
                    section.detail(data, id);
                },
                'error/:status': function (status) { // load the error page
                    section.error(status);
                }
            });
        }
    }

    //This is the object Function where will manipulate the DOM elements
    var section = {
        init: function (data) {
            this.overview(data);
            this.loading.remove();
        },
        map: function (data) {
            let dataCoin = data.map(function (i) { //Map function thanks to Keving Wang?
                let max_supply1 = "";
                if (i.max_supply == null) {
                    max_supply1 = "No data"
                }

                return {
                    id: i.id,
                    rank: i.rank,
                    name: i.name,
                    price: i.price_usd,
                    price_btc: i.price_btc,
                    volume: i['24h_volume_usd'],
                    market_cap: i.market_cap_usd,
                    supply: i.available_supply,
                    max_supply: max_supply1,
                    percent_change_1h: i.percent_change_1h,
                    percent_change_24h: i.percent_change_24h,
                    percent_change_7day: i.percent_change_7d,
                    name_abbreviation: i.symbol
                }
            });
            return dataCoin;
        },
        //The insert function will insert data to element with the same 'data-bind' name.
        insert: function (data, extraInfo) {
            //directive add extra information to the element for example 'class' or 'href'
            let directives = {
                coin_id: {
                    href: function () {
                        name = this.id
                        return "#detail/" + this.id; // Use this as base for going to detail
                    }
                },
                percent_change_1h: {
                    class: function () {
                        let value = this.percent_change_1h;
                        let className = helper.assignClass(value); // assign class to the value
                        return 'change ' + className; //'change' is just a classt  css that add a '%' sign
                    }
                },
                percent_change_24h: {
                    class: function () {
                        let value = this.percent_change_24h;
                        let className = helper.assignClass(value); // assign class to the value
                        return 'change ' + className; //'change' is just a classt  css that add a '%' sign
                    }
                },
                percent_change_7day: {
                    class: function () {
                        let value = this.percent_change_7day;
                        let className = helper.assignClass(value); // assign class to the value
                        return 'change ' + className; //'change' is just a classt  css that add a '%' sign
                    }
                },
                coin_image: {
                    src: function () {
                        /*We want to give a lower resolution picture on mobile. The if/else check
                        if the screen is a small(mobile) screen*/
                        let bigScreen = 799;
                        let width = helper.checkViewWidth();
                        let url;
                        let name = this.id; // name of the coin we want to get
                        if (width < bigScreen) {
                            url = 'https://www.livecoinwatch.com//images/icons32/' + name + '.png';
                        } else {
                            url = 'https://www.livecoinwatch.com//images/icons64/' + name + '.png';
                        }
                        return url;
                    },
                    alt: function () {
                        return this.id;
                    }
                },
                coin_market_cap: {
                    href: function () {
                        return "https://coinmarketcap.com/currencies/" + this.id;
                    }
                },
            };

            if (extraInfo === true) {
                //Render Detail page
                Transparency.render(document.querySelector('#detail'), data, directives);
            } else {
                //Render Overview page
                Transparency.render(document.querySelector('#start div'), data, directives);

            }
        },
        overview: function (data) {
            document.querySelector('#start').classList.remove('inactive'); //active overview container
            document.querySelector('.detail-container').classList.remove('active'); //remove active container
            this.insert(data);
        },
        detail: function (data, coinID) {
            function findCoin(name) {
                return name.id === coinID;
            }
            let pastAllongData = [data.find(findCoin)];
            let detailPage = true;
            this.insert(this.map(pastAllongData), detailPage);
            document.querySelector('#start').classList.add('inactive');
            document.querySelector('.detail-container').classList.add('active');
        },
        error: function (status) {
            document.querySelector('.error').classList.add('active');
            let error = {
                error: status
            };
            Transparency.render(document.querySelector('.error'), error);
        },
        loading: {
            set: function () {
                let loader = document.querySelectorAll('.loader');
                loader.forEach(function (i) { //add active state to loader to activate it
                    i.classList.add('active');
                })
            },
            remove: function () { //instead of remove class, we're removing the whole loader element
                let loader = document.querySelectorAll('.loader');
                loader.forEach(function (i) {
                    i.parentNode.removeChild(i);
                })
            }
        }
    }

    var helper = {
        assignClass: function (value) {
            /*This function assign a class to an element if the value is higher or
                        lower than 0*/
            let className = '';

            //Check value
            if (value < 0) {
                className = 'minus';
            } else if (value > 0) {
                className = 'plus';
            } else {
                className = 'neutral';
            }

            return className;
        },
        checkViewWidth: function () {
            let width = window.innerWidth;
            return width;
        },
        storage: {}
    }

    app.init(); //start application
})();