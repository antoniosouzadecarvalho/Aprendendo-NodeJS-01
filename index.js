//Express
const express = require("express");
const app = express();

//body-parser
const bodyParser = require("body-parser");

//Modulo database (./database/dabase.js);
const conexao = require("./database/database");


//Teste conexão com DB mysql
conexao
    .authenticate()
    .then(() => {
        console.log("Conectado com sucesso!")
    })
    .catch(err => {
        console.log(err)
    })

//Modulo Nomes (./database/Nomes.js)
const Nomes = require("./database/Nomes");

// Configurando EJS no express
app.set("view engine", "ejs");

// Configurando body-parser no express
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());



// EndPoint: Página raiz (EXIBIR NOMES)
app.get("/", (req, res) => {
    Nomes.findAll({raw: true})
        .then(dados => {
            res.render("index", {nomes: dados});
        })
        .catch(err => {
            console.log(err);
        })
});

// EndPoint: Página formúlario
app.get("/form", (req, res) => {
    res.render("form");
});

// EndPoint: Capturar NOME e persistir no DB
app.post("/dados", (req, res) => {
    const name = req.body.name;
    
    if(name == undefined){
        res.json({err: "Dados invalido!"});
    }else {
        Nomes.create({name: name})
            .then(res => {
                res.redirect("/");  
            })
    }

})

// EndPoint: Capturar ID e retorna Nome
app.get("/update/:id", (req, res) => {
    let idChar = req.params.id;
    let id = parseInt(idChar)
    
    if(!isNaN(id)){
        Nomes.findOne({ raw: true },{
            where: {id: id}
        })
        .then( resulht => {
            res.render("update", {Name: resulht});
        })
    }else {
        res.redirect("/")
    }
});

// EndPoint: Capturar ID, NOVO NOME e Atualizar NOME no DB 
app.post("/newName", (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    console.log(id)

    Nomes.update({name: name}, {
        where: {id: id}
    })
    .then(() => {
        res.redirect("/")
    })
    .catch(err => {
        console.log(err)
    })
});

// EndPoint: Capturar ID e REMOVER NOME no DB
app.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    Nomes.destroy({
        where: {id: id}
    })
    .then(() => {
        res.redirect("/");
    })
    .catch(err => {
        console.log(err)
    })
})



app.listen(3000, () => {
    console.log("Servidor iniciado!");
})