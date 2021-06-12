const express = require('express')
const app = express()
const router = express.Router()
const invoiceController = require('./controllers/invoiceController')

router.get('/', invoiceController.Home)
router.post('/convert', invoiceController.CsvToJson)
router.post('/process', invoiceController.ProcessJson)

module.exports = router

