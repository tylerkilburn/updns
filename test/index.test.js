

const exec = require('child_process').exec
const test = require('ava')
const net = require('net')


test.cb('Create DNS services', t => {
    const server = require('./../lib/index').createServer(1234)
    server
        .on('listening', () => {
            t.end()
        })
        .on('error', err => {
            t.fail(`DNS service creation failure : ${err}`)
            t.end()
        })
})


test.cb('Normal proxy request', t => {

    t.plan(1)

    const server = require('./../lib/index').createServer(6666)
    server
        .on('listening', () => {
            exec('dig @127.0.0.1 -t a google.com -p 6666 +short', (err, stdout) => {
                err ? 
                    t.fail(err)
                    : 
                    t.is(net.isIP(stdout.split('\n')[0].trim()) !== 0, true)
                t.end()
            })
        })
        .on('message', (domain, send, proxy) => {
            proxy('8.8.8.8')
        })

})


test.todo('Parse the specified domain name')


