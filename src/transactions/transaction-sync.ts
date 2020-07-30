import { ITransaction } from ".";

export default class TransactionSync implements ITransaction {
    private conn: any;
    constructor(conn: any){
        this.conn = conn;
    }
    async makeTransaction(txSigned: string) {
        return this.conn.postTransactionSync(txSigned)
    }
}