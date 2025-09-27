import { database } from '../../database/index.js'

export async function list(req, res){
    try {
        const pedidos = await database('pedidos').select();

        for (const pedido of pedidos) {
            const itens = await database('itens_pedido').where('id_pedido', pedido.id)
            pedido.itens = itens
        }
        
        res.status(200).send({
            message: 'Pedidos consultados com sucesso.',
            data: pedidos,
            error: false
        })
    } catch (error) {
        console.error(error); 
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
        const pedido = await database('pedidos').where('id', id).first();
        
        if (!pedido) {
            return res.status(404).send({ 
                message: 'Pedido não encontrado.',
                data: {},
                error: false
            })
        }
        
        const itens = await database('itens_pedido').where('id_pedido', id)
        pedido.itens = itens
        
        res.status(200).send({
            message: 'Pedido consultado com sucesso.',
            data: pedido,
            error: false
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Erro no servidor.',
            data: "",
            error: true
        })
    }
}

export async function listByCidade(req, res){
    try {
        const { cidade } = req.params
        
        const pedidos = await database('pedidos')
            .join('clientes', 'pedidos.id_cliente', 'clientes.id')
            .where('clientes.cidade', cidade)
            .select('pedidos.*')
            
        for (const pedido of pedidos) {
            const itens = await database('itens_pedido').where('id_pedido', pedido.id)
            pedido.itens = itens
        }
        
        res.status(200).send({
            message: 'Pedidos consultados com sucesso.',
            data: pedidos,
            error: false
        })
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'Erro no servidor.',
            data: "",
            error: true
        })
    }
}

export async function create(req, res){
    const trx = await database.transaction();
    
    try {
        const { id_cliente, data_pedido, itens } = req.body
        
        if (!id_cliente || !data_pedido || !Array.isArray(itens) || itens.length === 0) {
            await trx.rollback();
            return res.status(400).send({
                message: 'Dados obrigatórios não informados.',
                data: {},
                error: true
            })
        }

        // Verifica cliente
        const clienteExists = await trx('clientes').where('id', id_cliente).first();
        if (!clienteExists) {
            await trx.rollback();
            return res.status(404).send({
                message: 'Cliente não encontrado.',
                data: {},
                error: true
            })
        }

        // INSERE pedido corretamente
        const [pedido_id] = await trx('pedidos').insert({ 
            id_cliente: id_cliente,    
            data_pedido: data_pedido   
        });

        // Monta itens com os nomes certos
        const itensParaInserir = itens.map(item => ({
            id_pedido: pedido_id,      
            id_produto: item.id_produto,
            quantidade: item.quantidade,
            preco_unitario: trx.ref('preco').from('produtos').where('id', item.id_produto) // se quiser puxar preço direto
        }));

        await trx('itens_pedido').insert(itensParaInserir);

        await trx.commit();

        // Busca o pedido criado com os itens
        const pedido = await database('pedidos')
            .where('id', pedido_id)
            .first();

        const itensPedido = await database('itens_pedido')
            .where('id_pedido', pedido_id)
            .select('*');

        pedido.itens = itensPedido;

        res.status(201).send({
            message: 'Pedido cadastrado com sucesso.',
            data: pedido,
            error: false
        })
        
    } catch (error) {
        await trx.rollback();
        console.error('Erro detalhado:', error);
        
        res.status(500).send({
            message: 'Erro ao cadastrar pedido.',
            data: error.message,
            error: true
        })
    }
}
