

const dgram = require('dgram')
const EventEmitter = require('events').EventEmitter
const DNSParse = require('./parse')

let server

module.exports.closeServer = () => {
    server.close()
}

module.exports.createServer = (port = 53, addr) => {

    let dnsServerEvent = new EventEmitter()
    server = dgram.createSocket('udp4')

    server.on('error', error => {

        dnsServerEvent.emit('error', error)
        return dnsServerEvent

    })

    server.on('listening', () => {

        dnsServerEvent.emit('listening', server)
        return dnsServerEvent
        
    })

    server.on('message', (message, rinfo) => {

        let query = DNSParse.parse(message)
        let domain = DNSParse.domainify(query.question.qname)
        
        let respond = buf => {
            server.send(buf, 0, buf.length, rinfo.port, rinfo.address)
        }
        
        dnsServerEvent.emit('message', domain, ip => {

            respond(DNSParse.response(query, 1, DNSParse.numify(ip)))
            
        }, proxy => {

            let proxySoket = dgram.createSocket('udp4')

            proxySoket.on('error', err => {
                dnsServerEvent.emit('error', err)
            })

            proxySoket.on('message', response => {
                respond(response)
                proxySoket.close()
            })

            proxySoket.send(message, 0, message.length, 53, proxy)

        })

        return dnsServerEvent

    })

    if (addr) {
        server.bind(port, addr)
    } else {
        server.bind(port)
    }
    
    return dnsServerEvent

}


