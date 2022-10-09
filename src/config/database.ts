import { connect, ConnectOptions } from 'mongoose';
import { environment } from './environment';

const options: ConnectOptions = {
    autoIndex: true, // build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
  };

function dbConnect() {
    console.log("mongo uri" , environment.mongo_uri)
    return connect(environment.mongo_uri, options).then(() => {
        console.log('database connected')
    }).catch(error => {
        console.log(error)

        setTimeout(dbConnect, 5000);
    })
}

dbConnect()