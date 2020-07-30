import TransactionAsync from './transaction-async'
import TransactionSync from './transaction-sync'
import TransactionCommit from './transaction-commit'

export {
    TransactionAsync,
    TransactionSync,
    TransactionCommit
}

export interface ITransaction {
    makeTransaction(txSigned: string): any;
}