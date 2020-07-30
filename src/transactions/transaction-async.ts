import { ITransaction } from ".";

export default class TransactionAsync implements ITransaction {
    private conn: any;
    constructor(conn: any){
        this.conn = conn;
    }
    async makeTransaction(txSigned: string) {
        return this.conn.postTransactionAsync(txSigned)
    }
}