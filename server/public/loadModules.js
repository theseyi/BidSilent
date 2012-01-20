YUI().add('loadModules', function(Y) {
    var done = function(Y) { Y.Global.Hub.fire('modulesLoaded'); }
        , err = function() { Y.log('Error loading modules'); Y.log(arguments); }
        , modules = [ 'nav', 'login', 'register', done ]
        , mods = {
            nav: {
                requires: [ 'node-menunav' ]
                , fullpath: '/modules/nav.js'
            }
            , login: {
                requires: [ 'node', 'overlay' ]
                , fullpath: '/modules/login.js'
            }
            , register: {
                requires: [ 'node', 'overlay' ]
                , fullpath: '/modules/reg.js'
            }



        }

Y.log('loading');
Y.log(mods);
    Y.use.apply(YUI({ modules: mods, loadErrorFn: err }), modules);
});
