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
        try{
            let path = await this.SelectFile()
            console.log(path)
            if(path.split('/')[1] == 'undefined'){
                return {status: false, error: "Arquivo da fatura não encontrado"}
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
                fs.rename(oldPath, newPath, function(error){
                        if(error){
                            return {status: false, error: "Houve um erro ao converter"}
                            
                        }else{
                            return {status: true}
                    }
                    });
                fs.writeFileSync(newPath, JSON.stringify(jsonObj) ,'utf-8')   
            })
            return {status: true}
        } 
        catch(e){
            return {status: false, error: "Houve um erro ao converter"}
        }
    }

    async ProcessJson(){
        try{
            let path = await this.SelectFile()
            if(path.split('.')[1] != 'json'){
                return {status: false, error: "Arquivo não está em JSON"}
            }
            
            let invoiceProcess = []
            
            let invoice = JSON.parse(fs.readFileSync(path, 'utf-8')) 
            if(invoice.length < 1){
                return {status: false, error: "Não exite nenhuma fatura neste arquivo"}
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

            return {status: true, data: JSON.parse(fs.readFileSync(path, 'utf-8'))}
        }
        catch(e){
            return {status: false, error: "Houve um erro para salvar a fatura"}
        }
        
    }
    //fim csvtojson

    async AddInvoiceDad(title, amount){
        try{
            if(title == undefined || title == '' || !title.trim() || amount == undefined || amount == ''){
                return {status: false, error: "Preencha todos os campos"}
            }
            else{
                //criar data no formato 9999-99-99{
                const timeElapsed = Date.now();
                const today = new Date(timeElapsed);
                let dateT = today.toLocaleDateString()
                let year = dateT.split('/')[2]
                let month = dateT.split('/')[0]
                let day = dateT.split('/')[1]
                let date = year+'-'+day+'-'+month
                //fim criação da data

                const newInvoice = {
                    id: uuidv4(),
                    titulo: title,
                    categoria: "adicional",
                    valor: amount,
                    data: date,
                    pai: 1
                }

                return {status: true, data: newInvoice}
            }
        }
        catch(error){
            console.log(error)
            return {status: false, error: "Houve um erro para salvar a fatura"}
        }
    }
}

module.exports = new Invoice()