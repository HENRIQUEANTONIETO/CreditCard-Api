const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dbInvoice = new Schema({
    id: {
        type: String,
        required: true
    },
    
     titulo: {
        type: String,
        required: true
    },
    
    categoria: {
        type: String,
        required: true
    },

    valor: {
        type: Number,
        required: true
    },

    data: {
        type: String,
        required: true
    },

    pai: {
        type: Number,
        required: true
    }
})

mongoose.model('dbInvoices', dbInvoice)
