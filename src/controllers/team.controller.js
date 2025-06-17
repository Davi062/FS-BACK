const knex = require('../database/knex/index');

class TeamController {
    /**
     * Cria um novo membro do time
     */
    async create(req, res) {
        try {
            const { name, email, positions } = req.body;

            // Validação dos campos obrigatórios
            if (!name || !email || !positions) {
                return res.status(400).json({ 
                    error: 'Nome, email e cargo são campos obrigatórios' 
                });
            }

            // Verifica se o email já está cadastrado
            const existingTeamMember = await knex('teams')
                .where({ email })
                .first();

            if (existingTeamMember) {
                return res.status(400).json({ 
                    error: 'Já existe um membro da equipe com este email' 
                });
            }

            // Insere o novo membro no banco de dados
            const [teamId] = await knex('teams').insert({
                name,
                email,
                positions,
                created_at: new Date(),
                updated_at: new Date()
            });

            // Retorna o membro criado
            const newTeamMember = await knex('teams')
                .where({ id: teamId })
                .first();

            return res.status(201).json(newTeamMember);

        } catch (error) {
            console.error('Erro ao criar membro da equipe:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }


    /**
     * Lista todos os membros da equipe
     */
    async findAll(req, res) {
        try {
            const teams = await knex('teams').select('*');
            return res.json(teams);
        } catch (error) {
            console.error('Erro ao listar membros da equipe:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }

    /**
     * Busca um membro específico por ID
     */
    async findOne(req, res) {
        try {
            const { id } = req.params;
            const teamMember = await knex('teams')
                .where({ id })
                .first();

            if (!teamMember) {
                return res.status(404).json({ 
                    error: 'Membro da equipe não encontrado' 
                });
            }

            return res.json(teamMember);
        } catch (error) {
            console.error('Erro ao buscar membro da equipe:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }

    /**
     * Atualiza um membro da equipe
     */
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, positions } = req.body;

            // Verifica se o membro existe
            const existingTeamMember = await knex('teams')
                .where({ id })
                .first();

            if (!existingTeamMember) {
                return res.status(404).json({ 
                    error: 'Membro da equipe não encontrado' 
                });
            }

            // Verifica se o novo email já está em uso por outro membro
            if (email && email !== existingTeamMember.email) {
                const emailInUse = await knex('teams')
                    .where({ email })
                    .whereNot({ id })
                    .first();

                if (emailInUse) {
                    return res.status(400).json({ 
                        error: 'Este email já está em uso por outro membro da equipe' 
                    });
                }
            }


            // Atualiza o membro
            await knex('teams')
                .where({ id })
                .update({
                    name: name || existingTeamMember.name,
                    email: email || existingTeamMember.email,
                    positions: positions || existingTeamMember.positions,
                    updated_at: new Date()
                });

            // Retorna o membro atualizado
            const updatedTeamMember = await knex('teams')
                .where({ id })
                .first();

            return res.json(updatedTeamMember);

        } catch (error) {
            console.error('Erro ao atualizar membro da equipe:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }

    /**
     * Remove um membro da equipe
     */
    async delete(req, res) {
        try {
            const { id } = req.params;

            // Verifica se o membro existe
            const existingTeamMember = await knex('teams')
                .where({ id })
                .first();

            if (!existingTeamMember) {
                return res.status(404).json({ 
                    error: 'Membro da equipe não encontrado' 
                });
            }


            // Remove o membro
            await knex('teams')
                .where({ id })
                .delete();

            return res.status(204).send();

        } catch (error) {
            console.error('Erro ao remover membro da equipe:', error);
            return res.status(500).json({ 
                error: 'Ocorreu um erro ao processar sua solicitação' 
            });
        }
    }
}

module.exports = new TeamController();
