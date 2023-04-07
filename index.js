// Express
const express = require("express");
const app = express();

//body-parser
const bodyParser = require("body-parser");

//Conexão com o banco de dados
const connection = require("./database/database");


//Teste conexão com DB
connection
    .authenticate()
    .then(() => {
        console.log("Conectado com sucesso!")
    })
    .catch(err => {
        console.log(err)
    })


// Configurando EJS no express
app.set("view engine", "ejs");

// Configurando body-parser no express
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Models DB
const Names = require("./database/Names");



// Rota raiz
app.get("/", (req, res) => {
    Names.findAll({raw: true})
        .then(dados => {
            res.render("index", {names: dados});
        })
        .catch(err => {
            console.log(err);
        })
});

app.get("/form", (req, res) => {
    res.render("form");
})

app.post("/dados", (req, res) => {
    const name = req.body.name;
    
    if(name == undefined){
        res.json({err: "Dados invalido!"});
    }else {
        Names.create({name: name})
            .then(res => {
                res.redirect("/");  
            })
    }

})
//Rota: Pagina Update
app.get("/update/:id", (req, res) => {
    let idChar = req.params.id;
    let id = parseInt(idChar)
    
    if(!isNaN(id)){
        Names.findOne({ raw: true },{
            where: {id: id}
        })
        .then( resulht => {
            res.render("update", {Name: resulht});
        })
    }else {
        res.redirect("/")
    }
});

//Rota: Novo nome
app.post("/newName", (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    console.log(id)

    Names.update({name: name}, {
        where: {id: id}
    })
    .then(() => {
        res.redirect("/")
    })
    .catch(err => {
        console.log(err)
    })
});

//Rote: Deletar name
app.get("/delete/:id", (req, res) => {
    let id = req.params.id;

    Names.destroy({
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