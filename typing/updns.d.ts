

declare namespace updns {

    export function createServer(port: number, address: string): any

}

declare module 'updns' {
    export = updns
}


