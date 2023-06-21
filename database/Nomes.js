const conexao = require("./database");
const Sequelize = require("sequelize");

const Nomes= conexao.define('names',{
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Nomes.sync({force: false});

module.exports = Nomes;