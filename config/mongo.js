const mongoose = require('mongoose');

console.log('URL_MONGO:', process.env.URL_MONGO);

const clientOptions = {
    useNewUrlParser    : true,
    dbName             : 'apinode'
};

exports.initClientDbConnection = async () => {
    try{
        await mongoose.connect(process.env.URL_MONGO, clientOptions)
        console.log('Connected');
    } catch (error) {
        console.log(error);
        throw error;
    }
}
