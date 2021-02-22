import { Mongoose, connect } from 'mongoose';
let isConnected: boolean = false;

export const connectToDatabase = () => {
    console.log('Start connecting db...');
    if (isConnected) {
        return Promise.resolve();
    }
    const defaultDb = 'mongodb+srv://chehara:Che930102@cluster0.fehvx.mongodb.net/icm?retryWrites=true&w=majority';
    const dbUri: string = defaultDb;
    console.log(dbUri);
    return connect(dbUri,{ useUnifiedTopology: true,useNewUrlParser: true }).then((db: Mongoose) => {
        isConnected = db.connection.readyState == 1;
    }).catch(error => {
        console.log('db error:', error);
        return Promise.reject(error);
    });
};
