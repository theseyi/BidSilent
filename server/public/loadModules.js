YUI().add('loadModules', function(Y) {
    var done = function(Y) { Y.Global.Hub.fire('modulesLoaded'); }
        , err = function() { Y.log('Error loading modules'); Y.log(arguments); }
        , modules = []
        , mod
        , mods = {
            nav: {
                requires: [ 'node-menunav' ]
                , fullpath: '/modules/nav.js'
            }
            , login: {
                requires: [ 'node', 'panel', 'dd-plugin' ]
                , fullpath: '/modules/login.js'
            }
            , register: {
                requires: [ 'node', 'panel', 'dd-plugin' ]
                , fullpath: '/modules/reg.js'
            }
            , error: {
                requires: [ 'node', 'panel', 'dd-plugin' ]
                , fullpath: '/modules/error.js'
            }
            , user: {
                requires: [ 'node', 'panel', 'dd-plugin' ]
                , fullpath: '/modules/user.js'
            }
            , tokens: {
                requires: [ 'node', 'panel', 'dd-plugin' ]
                , fullpath: '/modules/tokens.js'
            }
/*
            , admin: {
                requires: [ 'node', 'cookie' ]
                , fullpath: '/modules/admin.js'
            }
*/
        }

    // Use them all
    for (mod in mods) {
        modules.push(mod);
    }

    // Add 'done' function
    modules.push(done);

    // Let 'er rip
    Y.use.apply(YUI({ modules: mods, loadErrorFn: err }), modules);
});
