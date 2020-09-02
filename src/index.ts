const driver = require('bigchaindb-driver')
import Axios from 'axios'
import {TransactionCommit, ITransaction, TransactionSync, TransactionAsync} from './transactions'

// BigchainDB server instance (e.g. https://example.com/api/v1/)
const PROTOCOL = 'http'
const HOST = '192.168.0.113'
const PORT = 33055
const API_PATH = `${PROTOCOL}://${HOST}:${PORT}/api/v1/`
const SENSOR_PRIVATE_KEY = '23b050f5d498563aad5dc07484d0ec1d'
const SENSOR_ID = '111111'

// Create a new keypair.
const alice = new driver.Ed25519Keypair(Buffer.from(SENSOR_PRIVATE_KEY, 'utf-8'))

// Send the transaction off to BigchainDB
const conn = new driver.Connection(API_PATH)

const createTransaction = (transaction: ITransaction,nonce: number) => {
    return new Promise(async (resolve, reject) => {
        const temperature = Math.floor(Math.random() * (40 - 10 + 1)) + 10;
        const humidity = Math.floor(Math.random() * (70 - 10 + 1)) + 10;
        // Construct a transaction payload
        const tx = driver.Transaction.makeCreateTransaction(
            // Define the asset to store, in this example it is the current temperature
            // (in Celsius) for the city of Berlin.
            { temperature, humidity, datetime: new Date().toString(), nonce },

            // Metadata contains information about the transaction itself
            // (can be `null` if not needed)
            { what: 'Temperature & Humidity sensor in room A034', sensorId: SENSOR_ID },

            // A transaction needs an output
            [driver.Transaction.makeOutput(
                driver.Transaction.makeEd25519Condition(alice.publicKey))
            ],
            alice.publicKey
        )

        // Sign the transaction with private keys
        const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
        try{
            const res = await transaction.makeTransaction(txSigned)
            resolve(res)
        }catch(err){
            reject(err)
        }
    })
}

const runTransactions = async (time: number, transaction: ITransaction) => {
    const startTime = Date.now()
    let counter = 0;
    while((Date.now() - startTime ) < time*1000) {
        try {
            await createTransaction(transaction, 1)
            counter++;
        } catch (err) {
            console.log(err)
        }
    }
    console.log(`Number of transactions with ${transaction.constructor.name} in ${time} seconds is: ${counter}`)
}

const main = async () => {
    const TIME = 10

    const transactionCommit: ITransaction = new TransactionCommit(conn)
    await runTransactions(TIME,transactionCommit)

    const transactionSync: ITransaction = new TransactionSync(conn)
    await runTransactions(TIME,transactionSync)

    const transactionAsync: ITransaction = new TransactionAsync(conn)
    await runTransactions(TIME,transactionAsync)
}

main()

