const mongoose = require('mongoose')

const connect = ()=>{
    mongoose.connect("mongodb://0.0.0.0/blog")
    .then(()=>{
        console.log('Server connected to Database')
    })
    .catch((err)=>{
        console.log('Error while connecting Database :=>', err)
    })
}

module.exports = connect