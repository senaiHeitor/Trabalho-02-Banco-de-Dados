import { 
  list as listMarcas, 
  listById as listMarcaById, 
  remove as removeMarca 
} from '../controllers/marcas.js'
import { 
  list as listProdutos, 
  listById as listProdutoById, 
  create as createProduto 
} from '../controllers/produtos.js'
import { 
  list as listClientes, 
  listById as listClienteById, 
  create as createCliente 
} from '../controllers/clientes.js'
import { 
  list as listPedidos, 
  listById as listPedidoById, 
  listByCidade, 
  create as createPedido 
} from '../controllers/pedidos.js'

export async function routes(app) {
    // Rota de teste
    app.get('/', async (request, reply) => {
        return reply.status(200).send({ 
            message: "API Ok.", 
            data: null, 
            error: false 
        })
    })
    
    // Marcas
    app.get('/marcas', listMarcas)
    app.get('/marcas/:id', listMarcaById)
    app.delete('/marcas/:id', removeMarca)
    
    // Produtos
    app.get('/produtos', listProdutos)
    app.get('/produtos/:id', listProdutoById)
    app.post('/produtos', createProduto)
    
    // Clientes
    app.get('/clientes', listClientes)
    app.get('/clientes/:id', listClienteById)
    app.post('/clientes', createCliente)
    
    // Pedidos
    app.get('/pedidos', listPedidos)
    app.get('/pedidos/:id', listPedidoById)
    app.get('/pedidos/cidade/:cidade', listByCidade)
    app.post('/pedidos', createPedido)
}