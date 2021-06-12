const fs = require('fs')
const { stringify } = require('querystring')
const { v4: uuidv4 } = require('uuid');
const { runInThisContext } = require('vm');

class Invoice{
    //inicio csvtojson

    async SelectFile(){
        function listFilesDir(dir, files) {
            let listFiles = fs.readdirSync(dir)
            return __dirname+'\\data/'+listFiles[0]
        }
        return listFilesDir(__dirname+'\\data')
    }

    async CsvToJson(){
        let path = await this.SelectFile()
        if(path.split('/')[1] == 'undefined'){
            return {status: false, err: "Arquivo da fatura não encontrado"}
        }
        if(path.split('.')[1] == 'json'){
            return {status: true}
        }
        const csvFilePath= path
        const csv=require('csvtojson')
        csv()
        .fromFile(csvFilePath)
        .then((jsonObj)=>{
            
            let oldPath = path.split('.')[0]+'.csv'
            let newPath = path.split('.')[0]+'.json'
            fs.rename(oldPath, newPath, function(err){
                    if(err){
                        return {status: false, err: "Houve um erro ao converter"}
                        
                    }else{
                        return {status: true}
                }
                });
            fs.writeFileSync(newPath, JSON.stringify(jsonObj) ,'utf-8')   
        })
        return {status: true} 
    }

    async ProcessJson(){
        let path = await this.SelectFile()
        if(path.split('.')[1] != 'json'){
            return {status: false, err: "Arquivo não está em JSON"}
        }
        
        let invoiceProcess = []
        
        let invoice = JSON.parse(fs.readFileSync(path, 'utf-8')) 
        if(invoice.length < 1){
            return {status: false, err: "Não exite nenhuma fatura neste arquivo"}
        }
        
        invoice.forEach(i =>{
            const id = uuidv4()
            if(i.title != "Pagamento recebido"){
                invoiceProcess.push({"id": id ,"titulo": i.title, "categoria": i.category,"valor": Number(i.amount), "data": i.date ,"pai": 0})
            }
        })

        if(JSON.stringify(invoice[0].id) == undefined){
            fs.writeFileSync(path, JSON.stringify(invoiceProcess) , 'utf-8')
        }

        return {status: true, result: JSON.parse(fs.readFileSync(path, 'utf-8'))}
        
        
    }
    //fim csvtojson
}

module.exports = new Invoice()