const Invoice = require('../models/Invoice')
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
            res.status(200)
            res.json(result.result)
        }
    }

}

module.exports = new invoiceController()