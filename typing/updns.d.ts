

declare namespace updns {


    export function createServer(
        port: number, 
        address?: string
    ): EventEmitter
    

    interface EventEmitter {
        
        on(event: 'error', callBack: (
            error: Error) => void
        ): EventEmitter


        on(event: 'listening', callBack: (
            server: any) => void  // dgrm.Socket
        ): EventEmitter


        on(event: 'message', callBack: (
            domain: string, 
            send: (address: string) => void, 
            proxy: (address: string) => void
        ) => void): EventEmitter

    }

}


declare module 'updns' {
    export = updns
}


