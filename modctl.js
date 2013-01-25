var pidDir = '/tmp/'
    modDir = __dirname + '/server/modules/'
    , fs = require('fs')
    , fork = require('child_process').fork
    , command = process.argv[2]
    , modules = [ process.argv.slice(3) ]
    , commands = { 
		start: start
		, stop: stop
		, restart: function() { stop.apply(this, modules); start.apply(this, modules) } 
	};
    ;

if (process.argv[3] === 'all') {
    modules = [ fs.readdirSync(modDir) ];
}

if (commands[command]) {
    commands[command].apply(this, modules);
} else {
    console.error('unknown command: ' + command);
}

process.exit(0);

function start(modules) {
    if (modules) {
        modules.forEach(function(module) {
            if (!module.match('.js')) {
                module += '.js';
            }
            var st = fork(modDir + module, []);
            fs.writeFileSync(pidDir + module + '.pid', st.pid, 'utf8');
        });
    }
}

function stop(modules) {
    if (modules) {
        modules.forEach(function(module) {
            if (!module.match('.js')) {
                module += '.js';
            }

            var pidFile = pidDir + module + '.pid' , pid;

            try {
                pid = fs.readFileSync(pidFile, 'utf8');
                process.kill(pid);
                fs.unlinkSync(pidFile);
            } catch(e) {
                console.log('Error killing ' + module + ': ' + e);
            }

        });
    }
}

