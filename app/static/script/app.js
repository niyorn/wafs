import {routes} from './routes.js';
import {api} from './api.js';
import {section} from './section.js';
import {helper} from './helper.js';

var app = {
    init: function () {
        routes.init();
    }
}

app.init ();

