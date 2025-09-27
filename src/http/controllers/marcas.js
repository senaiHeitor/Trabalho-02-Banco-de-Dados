import { database } from '../../database/index.js'

export async function list(request, reply) {
    try {
        console.log('Consultando marcas no banco...');
        const marcas = await database('marcas').select();
        
        console.log(`Encontradas ${marcas.length} marcas`);
        
        return reply.status(200).send({
            message: 'Dados consultados com sucesso.',
            data: marcas,
            error: false
        });
    } catch (error) {
        console.error('Erro ao consultar marcas:', error);
        return reply.status(500).send({
            message: 'Erro no servidor.',
            data: error.message,
            error: true
        });
    }
}

export async function listById(request, reply) {
    try {
        const { id } = request.params;
        const query = await database('marcas').where('id', id);

        if(!query.length) {
            return reply.status(404).send({
                message: 'Marca não encontrada.',
                data: {},
                error: false
            });
        }

        return reply.status(200).send({ 
            message: 'Dados consultados com sucesso.',
            data: query[0],
            error: false
        }); 
    } catch (error) {
        console.error('Erro ao consultar marca por ID:', error);
        return reply.status(500).send({
            message: 'Erro no servidor.',
            data: error.message,
            error: true
        });
    }
}

export async function remove(request, reply) {
    try {
        const { id } = request.params;
        const deleted = await database('marcas').where('id', id).del();
        
        if (!deleted) {
            return reply.status(404).send({
                message: 'Marca não encontrada.',
                data: {},
                error: true
            });
        }
        
        return reply.status(200).send({
            message: 'Marca excluída com sucesso.',
            data: {},
            error: false
        });
    } catch (error) {
        console.error('Erro ao excluir marca:', error);
        return reply.status(500).send({
            message: 'Erro ao excluir marca.',
            data: error.message,
            error: true
        });
    }
}