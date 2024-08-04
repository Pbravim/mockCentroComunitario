const Router = require('express');
const relatorioController = require('../controllers/relatorioController');

const router = new Router();

/**
 * @swagger
 * /relatorios/ocupacao_centro:
 *   get:
 *     summary: Filtrar centros por ocupação
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/ocupacao_centro', relatorioController.filterByOcupacao);

/**
 * @swagger
 * /relatorios/recursos_centro:
 *   get:
 *     summary: Obter média de recursos dos centros
 *     tags: [Relatórios]
 *     responses:
 *       200:
 *         description: Sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/recursos_centro', relatorioController.getMediaRecursos);

/**
 * @swagger
 * /relatorios/historico_trocas/{id}:
 *   get:
 *     summary: Obter histórico de trocas de um centro comunitário
 *     tags: [Relatórios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do centro comunitário
 *       - in: query
 *         name: dataInicio
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Data de início no formato ISO 8601 (por exemplo, `2024-08-01T16:00:00.000Z`)
 *     responses:
 *       200:
 *         description: Sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/historico_trocas/:id', relatorioController.getHistoricoNegociacoes);

module.exports = router;
