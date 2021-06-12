const express = require('express')
const app = express()
const router = require('./routes')
const path = require('path');
const mongoose = require('mongoose')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


 //mongoose
 mongoose.Promise = global.Promise
 mongoose.connect('mongodb://localhost/creditcard',{
     useNewUrlParser: true,
     useUnifiedTopology: true
 }).then(() =>{
     console.log('Conectado ao mongoDB!')
 }).catch((err) =>{
     console.log('Erro ao se conectar ao mongoDB: ' + err)
 }) 

app.get('/up', (req,res) =>{
    res.sendFile('index.html', {root: __dirname})
})

app.get('/convert', (req, res) =>{
    res.sendFile('convert.html', { root : __dirname})
})

app.get('/process', (req,res) =>{
    res.sendFile('create.html', { root : __dirname})
})

app.post('/processar', (req, res) =>{
    console.log(req.body)
    res.send('olá')
})

//upload arquivos
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "src/models/data")
    },
    filename: function(req, file, cb){
        cb(null, 'invoice.'+file.originalname.split('.')[1])
    }
})

const fileFilter = function(req, file, cb) {
    const allowedTypes = ["application/vnd.ms-excel", "application/json"]
  
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error("Wrong file type")
      error.code = "LIMIT_FILE_TYPES"
      return cb(error, false)
    }
  
    cb(null, true)
  }


const upload = multer({storage, fileFilter})


app.post('/upload', upload.single('file'), (req, res) =>{
    if(req.file == undefined){
        res.status(400)
        res.json({err: "Selecione um arquivo para importar"})
    }
    else{
        res.status(200)
        res.json({file: req.file})
    }
    
    
})

app.use(function(err, req, res, next) {
    if (err.code === "LIMIT_FILE_TYPES") {
        res.status(400)
        res.json({err: "Somente arquivos csv e json são permitidos"})
        return 
    }
  })

app.use('/',router)
app.listen(3333, () =>{
    console.log('Servidor rodando...')
})