declare module 'ethereumjs-tx' {
    import { Buffer } from 'buffer';

    export class Transaction {
        constructor(data: any);
        sign(privateKey: Buffer): void;
        serialize(): Buffer;
    }
}
