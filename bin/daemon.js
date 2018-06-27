

const child_process = require('child_process')


module.exports.createProcess = filePath => {

    let argvs = [...process.argv].slice(1, process.argv.length)

    let options = {
        stdio: 'ignore',
        env: process.env,
        cwd: process.cwd(),
        detached: true
    }

    let child = child_process.fork(filePath, argvs, options)

    child.unref()

    return child

}


module.exports.killProcess = pid => new Promise((success, fail) => {

    function error(e) {
        if(e.code === 'ESRCH'){
            return 0
        }else if(e.code === 'EPERM'){
            return -1
        }else {
            return e.code
        }
    }

    try {
        // Does the process exist ?
        process.kill(pid, 0)
        
        try {
            process.kill(pid)
            success()
        }catch(env) {
            fail(error(env))
        }

    }catch(env) {
        fail(error(env))
    }

})


module.exports.spawn = (processName, ...argv) => {

    return new Promise((suc, err) => {

        const child = child_process.spawn(processName,  argv, {
            stdio: 'inherit'
        })

        child.on('error', err)

        child.on('exit', (code, signal) => {
            code === 0 ? suc(child) : err(signal)
        })

    })

}


