const knex = require('../database/knex/index');

class ClientController {
    /**
     * Cria um novo cliente
     */
    async create(req, res) {
        try {
            const { name, email, phone_number, company_name } = req.body;

            // Validação dos campos obrigatórios
            if (!name || !email) {
                return res.status(400).json({ 
                    error: 'Nome e email são campos obrigatórios' 
                });
            }

            // Verifica se o email já está cadastrado
            const existingClient = await knex('clients')
                .where({ email })
                .first();

            if (existingClient) {
                return res.status(400).json({ 
                    error: 'Já existe um cliente cadastrado com este email' 
                });
            }

            // Insere o novo cliente no banco de dados
            const [clientId] = await knex('clients').insert({
                name,
                email,
                phone_number: phone_number || null,
                company_name: company_name || null,
                created_at: new Date(),
                updated_at: new Date()
            });

            // Retorna o cliente criado
            const newClient = await knex('clients')
                .where({ id: clientId })
                .first();

            return res.status(201).json(newClient);

        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }

    /**
     * Lista todos os clientes
     */
    async findAll(req, res) {
        try {
            const clients = await knex('clients').select('*');
            return res.json(clients);
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }
}

module.exports = new ClientController();
