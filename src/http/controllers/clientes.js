import { database } from '../../database/index.js'

export async function list(req, res){
    try {
        const query = await database('clientes').select();
        res.status(200).send({
            message: 'Clientes consultados com sucesso.',
            data: query,
            error: false
        })
    } catch (error) {
        res.status(500).send({
            message: 'Erro no servidor.',
            data: "",
            error: true
        })
    }
}

export async function listById(req, res){
    try {
        const { id } = req.params
        const query = await database('clientes').where('id', id);

        if(!query.length) {
            return res.status(200).send({
                message: 'Cliente não encontrado.',
                data: {},
                error: false
            })
        }

        return res.status(200).send({ 
            message: 'Cliente consultado com sucesso.',
            data: query[0],
            error: false
        }) 
    } catch (error) {
        res.status(500).send({
            message: 'Erro no servidor.',
            data: "",
            error: true
        })
    }
}

export async function create(req, res){
    try {
        const { nome, email, cidade} = req.body
        if (!nome || !cidade) {
            return res.status(400).send({
                message: 'Dados obrigatórios não informados.',
                data: {},
                error: true
            })
        }
        const [id] = await database('clientes').insert({ nome, email, cidade })
        const novoCliente = await database('clientes').where('id', id).first()
        res.status(201).send({
            message: 'Cliente cadastrado com sucesso.',
            data: novoCliente,
            error: false
        })
    } catch (error) {
        res.status(500).send({
            message: 'Erro ao cadastrar cliente.',
            data: "",
            error: true
        })
    }
}