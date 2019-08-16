const express = require('express')
const mongoose = require("mongoose")
const bodyParser = require('body-parser')
const env = require('env2')('.env')

const app = express()
const port = 2020
app.use(bodyParser.json())
// Base de datos NoSQL
mongoose.connect(process.env.DB, { useNewUrlParser: true, useFindAndModify: false }) // 

const ClienteSchema = new mongoose.Schema({
    nombre: String,
    limite_credito: Number,
    deuda: { type: Number, default: 0 }
});
const Cliente = mongoose.model("Cliente", ClienteSchema);

// Endponits
app.get('/', (req, res)=>{
    try{
        res.render("form.ejs")
    } catch(error){
        console.error(error)
    }
})

app.post('/fiao', async (req, res)=>{
    try{
        const {nombre, limite_credito} = req.body
        const data = {
            nombre,
            limite_credito
        }
        console.log(req)
        // await Cliente.create(data, (error, nuevoCliente)=>{
        //     if(error) throw new Error(error)
        //     res.send(nuevoCliente)
        // })
    } catch(error){
        res.status(500).send(error)
    }
})

app.get('/fiao', async (req, res)=>{
    await Cliente.find({}, (error, data)=>{
        if(error) throw new Error(error)
        res.render('show.ejs', {data})
    })
})

app.get('/fiao/:id', async (req, res)=>{
    const id = req.params.id
    await Cliente.findById(id, (error, cliente)=>{
        if(error || !cliente){ res.redirect('/fiao') }
        res.send(cliente)
    })
})

app.put('/fiao/:id', async (req, res)=>{
    try {
        const id = req.params.id
        const newInfo = req.body
        
        await Cliente.findByIdAndUpdate(id, newInfo, (error, cliente)=>{
            if(error || !cliente) { res.send("Id es incorrecto") }
            res.send(cliente)
        })
        
    } catch (error) {
        res.status(500).send(error)
    }
})

app.delete('/fiao/:id', async (req, res)=>{
    try {
        const id = req.params.id
        if(!id){ res.send('id es incorrecto') }

        await Cliente.findByIdAndRemove(id, (error, cliente)=>{
            if(error) { res.redirect("/fiao"+id) }
            res.send(`Cliente fue borrado!`)
        })
    } catch (error) {
        res.status(500).send(error)
    }
})

app.listen(port, ()=>{
    console.log(`Corriendo en puerto ${port}`)
})