

const test = require('ava')
const fs = require('fs')
const path = require('path')
const daemon = require('./../bin/daemon')


test.cb('Creating daemon', t => {

    t.plan(2)
    const testFilePath = path.join(__dirname, './process.test.js')

    fs.writeFileSync(testFilePath, `
        process.send({
            message: 'ok'
        })
    `)

    const child = daemon.createProcess(testFilePath)

    t.is(typeof child.pid, 'number')

    child.on('message', data => {

        daemon.killProcess(child.pid)
        fs.unlinkSync(testFilePath)
        t.is(data.message, 'ok')
        t.end()

    })
    

})


test('Spawn process', async t => {

    t.plan(2)
    await daemon.spawn('touch', 'test.txt')

    await daemon.spawn('rm-error').catch(e => {
        t.is(e.path, 'rm-error')
    })

    await daemon.spawn('rm', '-rf', 'test.txt').then(child => {
        t.is(typeof child.pid, 'number')
    })

})


test.todo('Kill process')


