const mongoose = require('mongoose')
const Schema = mongoose.Schema

const dbInvoice = new Schema({
    InvoiceDate: {
        type: String,
        required: true
    },
    Invoice: {
       type: Object,
       required: true
    }

})

mongoose.model('dbInvoices', dbInvoice)
