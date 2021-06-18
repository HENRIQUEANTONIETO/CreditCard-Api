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

    async ListInvoices(req, res){
        dbInvoice.find().then((invoices) =>{
            res.status(200)
            res.json(invoices)
        }).catch(err =>{
            res.status(400)
            res.json({error: "Houve um erro para listar as faturas"})
        })
    }

    async FindInvoice(req, res){
        dbInvoice.findOne({_id: req.params.id}).then((invoice) =>{
            res.status(200)
            res.json(invoice)
        }).catch(err =>{
            res.status(400)
            res.json({error: "Houve um erro para lista a fatura"})
        })
    }

    async MarkForDad(req, res){
        dbInvoice.findOne({_id: req.params.id}).then((invoice) =>{
            let indexf = invoice.Invoice.findIndex(i => i.id === req.params.idi)
            if(invoice.Invoice[indexf].pai === 1){
                invoice.Invoice[indexf].pai = 0
            }
            else{
                invoice.Invoice[indexf].pai = 1
            }
            
            let UpInvoice = invoice.Invoice
        
            invoice.Invoice = {UpInvoice}
            invoice.Invoice = invoice.Invoice.UpInvoice
            
            invoice.save().then(() =>{
                res.json(invoice)
            })
            
        }).catch(error =>{
            res.status(400)
            res.json({error: "Houve um erro para listar a fatura ou ela não existe"})
        })
    }

    

}

module.exports = new invoiceController()