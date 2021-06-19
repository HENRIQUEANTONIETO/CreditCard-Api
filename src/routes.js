const express = require('express')
const app = express()
const router = express.Router()
const invoiceController = require('./controllers/invoiceController')

router.get('/', invoiceController.Home)
router.post('/convert', invoiceController.CsvToJson)
router.post('/process', invoiceController.ProcessJson)
router.get('/invoices', invoiceController.ListInvoices)
router.get('/invoices/:id', invoiceController.FindInvoice)
router.put('/invoices/:id/:idi', invoiceController.MarkForDad)
router.put('/invoices/:id', invoiceController.NewInvoiceDad)
router.get('/invoices/totalizer/:id', invoiceController.Totalizer)
router.delete('/invoices/:id', invoiceController.DeleteInvoice)
router.delete('/invoices/:id/:idi', invoiceController.DeleteInvoiceIn)

module.exports = router

