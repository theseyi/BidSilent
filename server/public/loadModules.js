YUI().add('loadModules', function(Y) {
    var done = function(Y) { Y.Global.Hub.fire('modulesLoaded'); };

    Y.LoadModules = function(mods, errFun) {
        var mod
            , modules = []
            , err = errFun || function() { Y.log('Error loading modules'); Y.log(arguments); }
        ;

        // Use them all
        for (mod in mods) {
            modules.push(mod);
        }

        // Add 'done' function
        modules.push(done);

        // Let 'er rip
        Y.use.apply(YUI({ modules: mods, loadErrorFn: err }), modules);
    }
});
