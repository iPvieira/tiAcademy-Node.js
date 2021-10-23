const express = require('express');
const cors = require('cors');

const { Sequelize } = require('./models')

const models = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

let cliente = models.Cliente;
let itempedido = models.ItemPedido;
let pedido = models.Pedido;
let servico = models.Servico;

app.get('/', function (req, res) {
    res.send("Hello World!!")
});

app.post('/servicos', async (req, res) => {
    await servico.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Serviço criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});
app.post('/clientes', async (req, res) => {
    await cliente.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Cliente criado com sucesso"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/pedidos', async (req, res) => {
    await pedido.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Pedido criado com sucesso!"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.post('/itenspedido', async (req, res) => {
    await itempedido.create(req.body
    ).then(function () {
        return res.json({
            error: false,
            message: "Item criado com sucesso"
        })
    }).catch(function (error) {
        return res.status(400).json({
            error: true,
            message: "Foi impossível se conectar."
        })
    });
});

app.get('/listaservicos', async (req, res) => {
    await servico.findAll({
        //raw: true,
        order: [['nome', 'ASC']]
    }).then(function (servicos) {
        res.json({ servicos })
    });
});

app.get('/listaclientes', async (req, res) => {
    await cliente.findAll({
        order: [['createdAt', 'ASC']]//ordem de antiguidade
    }).then(function (clientes) {
        res.json({ clientes })
    });
});

app.get('/listaitenspedidos', async (req, res) => {
    await itempedido.findAll({
        order: [['valor', 'DESC']]//ordem de maior valor
    }).then(function (itemPedidos) {
        res.json({ itemPedidos })
    });
});

app.get('/servicosbase', async (req, res) => {
    await servico.count('id').then(function (servicos) {//conta o número de ids
        res.json({ servicos });
    });
});

app.get('/clientesbase', async (req, res) => {
    await cliente.count('id').then(function (clientes) {
        res.json({ clientes });
    });
});

app.get('/pedidosbase', async (req, res) => {
    await cliente.count('id').then(function (pedidos) {
        res.json({ pedidos });
    });
});

app.get('/servico/:id', async (req, res) => {
    await servico.findByPk(req.params.id)
        .then(serv => {
            return res.json({
                error: false,
                serv
            });
        }).catch(function (erro) {
            return res.status(400).json({
                error: true,
                message: "Erro: Serviço não encontrado"
            });
        });
});

app.put("/atualizaservico", async (req, res) => {
    await servico.update(req.body, {
        where: { id: req.body.id }
    }).then(function () {
        return res.json({
            error: false,
            message: "Serviço alterado com sucesso"
        })
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro na alteração do serviço"
        })
    })
});

app.get('/pedidos/:id', async (req, res) => {
    await pedido.findByPk(req.params.id, { include: [{ all: true }] })
        .then(ped => {
            return res.json({ ped });
        })
})

app.put('/pedidos/:id/editaritem', async (req, res) => {
    const item = {
        quantidade: req.body.quantidade,
        valor: req.body.valor
    };

    if (!await pedido.findByPk(req.params.id)) {
        return res.status(400).json({
            error: true,
            message: "Pedido não encontrado"
        })
    }
    if (!await servico.findByPk(req.body.ServicoId)) {
        return res.status(400).json({
            error: true,
            message: "Serviço não encontrado"
        })
    }
    await itempedido.update(item, {
        where: Sequelize.and({ ServicoId: req.body.ServicoId },
            { PedidoId: req.params.id })
    }).then(function (itens) {
        return res.json({
            error: false,
            message: "Pedido alterado com sucesso!",
            itens

        });
    }).catch(function (erro) {
        return res.status(400).json({
            error: true,
            message: "Erro: não foi possível alterar."
        })
    });
});

app.get('/clientes/:id/pedidos', async (req, res) => {
    await cliente.findByPk(req.params.id, { include: [{ all: true }] })
        .then(serv => {
            return res.json({ serv });
        })
})

app.get('/excluircliente/:id', async(req, res)=>{
     await cliente.destroy({
        where: {id: req.params.id}
    }).then(function(){
        return res.json({
            error:false, 
            message: "Cliente foi excluído com sucesso!"
        });
    }).catch(function(erro){
        return res.status(400).json({
            error:true,
            message: "Erro ao excluir o cliente"
        })
    })
});

let port = process.env.PORT || 3001;

app.listen(port, (req, res) => {
    console.log("Servidor ativo: http://localhost:3001");
})