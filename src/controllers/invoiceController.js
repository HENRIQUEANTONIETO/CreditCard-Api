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
            res.json(result.error)
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
            res.json(result.error)
        }
        else{
            const newInvocie = {
                InvoiceDate: req.body.InvoiceDate,
                Invoice: result.data
            }
            new dbInvoice(newInvocie).save().then(() =>{
                res.status(200)
                res.json({message: "Fatura salva no BD com sucesso!"})
            }).catch((error) =>{
                console.log(error)
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
            }).catch(error =>{
                res.status(400)
                res.json({error: "Houve um erro para marcar para pai"})
            })
            
        }).catch(error =>{
            res.status(400)
            res.json({error: "Houve um erro para listar a fatura ou ela não existe"})
        })
    }

    async NewInvoiceDad(req, res){
        try{
            const {id} = req.params
            const {title, amount} = req.body
            const result = await Invoice.AddInvoiceDad(title, amount)
            if(!result.status){
                throw result.error
            }
            else{
                dbInvoice.findOne({_id: id}).then((invoice) =>{
                    let newInvoice = result.data
                    let updatedInvoice = invoice.Invoice
                    updatedInvoice.push(newInvoice)

                    invoice.Invoice = {updatedInvoice}
                    invoice.Invoice = invoice.Invoice.updatedInvoice

                    invoice.save().then(() =>{
                        res.status(200)
                        res.json(invoice)
                    }).catch(error =>{
                        res.status(400)
                        res.json({error: error})
                    })
                }).catch((error) =>{
                    res.status(400)
                    res.json({error: "Fatura não existe"})
                })
            }
            
        }
        catch(error){
            res.status(400)
            res.json({error: error})
        }
    }

    async Totalizer(req, res){
        dbInvoice.findOne({_id: req.params.id}).then((invoice) =>{
            let TotalCard = []
            let TotalDad = []
            
            invoice.Invoice.forEach(i =>{
                if(i.categoria != "adicional"){
                    TotalCard.push(i.valor)
                }
                if(i.pai === 1){
                    TotalDad.push(i.valor)
                }
            })

            if(TotalCard.length < 1){
                res.status(200)
                res.json({TotalCard: 0, TotalDad: 0, TotalMe: 0})
            }
            TotalCard = TotalCard.reduce((total, amount) => total + amount) 
            if(TotalDad.length < 1){
                res.status(200)
                res.json({TotalCard, TotalDad: 0, TotalMe: TotalCard})
            }
            TotalDad = TotalDad.reduce((total, amount) => total + amount)
    
            let TotalMe = TotalCard - TotalDad
            res.status(200)
            res.json({TotalCard, TotalDad, TotalMe})

        }).catch((error) =>{
            res.status(400)
            res.json({error: "Fatura não existe"})
        })
    }

    async DeleteInvoice(req, res){
        dbInvoice.deleteOne({_id: req.params.id}).then((invoice) =>{
            if(invoice.n === 0){
                throw 'Fatura não encontrada'
            }
            res.status(200)
            res.json({})
        }).catch((error) =>{
            res.status(400)
            res.json({error: error})
        })
    }

    async DeleteInvoiceIn(req, res){
        const {id, idi} = req.params
        dbInvoice.findOne({_id: id}).then((invoice) =>{
            let indexf = invoice.Invoice.findIndex(i => i.id === idi)
            if(indexf < 0){
                throw "Fatura não existe"
            }

            let updatedInvoice = invoice.Invoice
            updatedInvoice.splice(indexf, 1)

            invoice.Invoice = {updatedInvoice}
            invoice.Invoice = invoice.Invoice.updatedInvoice

            invoice.save().then(() =>{
                res.status(200)
                res.json(invoice)
            }).catch(error =>{
                res.status(400)
                res.json({error: "Houve um erro para salvar a fatura"})
            })
        }).catch((error) =>{
            res.status(400)
            res.json({error: error})
        })
    }

}

module.exports = new invoiceController()