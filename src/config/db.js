const mongoose = require('mongoose')

const connect = ()=>{
    mongoose.connect(process.env.MONGODB_URI)
    .then(()=>{
        console.log('Server connected to Database')
    })
    .catch((err)=>{
        console.log('Error while connecting Database :=>', err)
    })
}

module.exports = connect