const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

const livrosPath = path.join(__dirname, 'livros.json')

const getLivros = () => {
    const data = fs.readFileSync(livrosPath)
    return JSON.parse(data)
}

// Rotas

app.get('/api/livros', (req,res) => {
    const livros = getLivros()
    res.json(livros)
})

app.get('/api/livros/:id', (req,res) =>{
    const{id} = req.params 
    const livros = getLivros()  
    const livro = livros.find(f => f.id == id)
    
    if(livro){
        res.json(livro)
    }else{
        res.status(404).json({error:"livros não encontrado"})
        } 
    }
)

app.post('/api/livros',(req,res) => {
    const{titulo, autor, editora, ano} = req.body

    if(!titulo || !autor || !editora || !ano){
        return res.status(400).json({ error: "Preencha todos os campos"})
    }
    const livros = getLivros()

    const novoLivro = {
        id: livros.length +1,
        titulo,
        autor,
        editora,
        ano
    }
    livros.push(novoLivro)  

    fs.writeFileSync(livrosPath, JSON.stringify(livros, null, 2))

    res.status(201).json(novoLivro)
})

app.delete('/api/livros/:id', (req,res) => {
    const{id} = req.params 
    let livros = getLivros()
    livros = livros.filter( l => l.id != id )

    fs.writeFileSync(livrosPath, JSON.stringify(livros,null, 2))

    res.status(204).send()
})
  
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`)
    })




