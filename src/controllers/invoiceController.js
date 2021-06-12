const mongoose = require('mongoose')
const Invoice = require('../models/Invoice')
require('../models/dbInvoice')
const dbInvoice = mongoose.model('dbInvoices')

class invoiceController{
    async Home(req, res){
        res.json({message: "Oláaaa"})
    }

    async CsvToJson(req, res){
        let result = await Invoice.CsvToJson()
        if(!result.status){
            res.status(400)
            res.json(result.err)
        }
        else{
            res.status(200)
            res.json({message: 'convertido'})
        }
    }

    async ProcessJson(req, res){
        let result = await Invoice.ProcessJson()
        if(!result.status){
            res.status(400)
            res.json(result.err)
        }
        else{
            const newInvocie = {
                InvoiceDate: req.body.InvoiceDate,
                Invoice: result.data
            }
            new dbInvoice(newInvocie).save().then(() =>{
                res.status(200)
                res.json({message: "Fatura salva no BD com sucesso!"})
            }).catch((err) =>{
                console.log(err)
                res.status(400)
                res.json({error: "Houve um erro para salvar no BD"})
            })
            
        }
    }

}

module.exports = new invoiceController()