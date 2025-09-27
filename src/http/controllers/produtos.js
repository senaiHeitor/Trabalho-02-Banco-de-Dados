import { database } from '../../database/index.js'

export async function list(req, res){
    try {
        const query = await database('produtos').select();
        res.status(200).send({
            message: 'Produtos consultados com sucesso.',
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
        const query = await database('produtos').where('id', id);

        if(!query.length) {
            return res.status(200).send({
                message: 'Produto não encontrado.',
                data: {},
                error: false
            })
        }

        return res.status(200).send({ 
            message: 'Produto consultado com sucesso.',
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
        const { nome, preco, estoque, id_marca } = req.body
        if (!nome || !preco || !estoque ||!id_marca) {
            return res.status(400).send({
                message: 'Dados obrigatórios não informados.',
                data: {},
                error: true
            })
        }
        const [id] = await database('produtos').insert({ nome, preco, estoque, id_marca })
        const novoProduto = await database('produtos').where('id', id).first()
        res.status(201).send({
            message: 'Produto cadastrado com sucesso.',
            data: novoProduto,
            error: false
        })
    } catch (error) {
        res.status(500).send({
            message: 'Erro ao cadastrar produto.',
            data: "",
            error: true
        })
    }
}