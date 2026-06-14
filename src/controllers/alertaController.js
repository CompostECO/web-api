var alertaModel = require("../models/alertaModel");
var empresaModel = require("../models/empresaModel")

function listarPorComposteira(req, res) {
    var idComposteira = req.params.idComposteira;

    if (idComposteira == undefined) {
        res.status(400).send("O idComposteira está undefined!");
        return;
    }

    alertaModel.buscarUltimos5DaComposteira(idComposteira)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).json("Nenhum alerta encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

async function listarPorProdutor(req, res) {
    var userId = req.params.idProdutor;

    if (userId == undefined) {
        res.status(400).send("O idProdutor está undefined!");
        return;
    }

    var idProdutor = await empresaModel.buscarPorUsuario(userId)

    alertaModel.buscarUltimos50DoProdutor(idProdutor[0].id)
        .then(function (resultado) {
            if (resultado.length > 0) {
                res.status(200).json(resultado);
            } else {
                res.status(204).json("Nenhum alerta encontrado!");
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    listarPorComposteira,
    listarPorProdutor
};
