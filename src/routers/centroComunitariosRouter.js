const Router = require('express');
const centroComunitarioController = require('../controllers/centroComunitarioController');

const router = new Router();

/**
 * @swagger
 * /centroComunitario:
 *   post:
 *     summary: Registrar um novo centro comunitário
 *     tags: [Centro Comunitário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do centro comunitário
 *               rua:
 *                 type: string
 *                 description: Rua do centro comunitário
 *               numero:
 *                 type: string
 *                 description: Número do centro comunitário
 *               bairro:
 *                 type: string
 *                 description: Bairro do centro comunitário
 *               cidade:
 *                 type: string
 *                 description: Cidade do centro comunitário
 *               lotacao_atual:
 *                 type: integer
 *                 description: Lotação atual do centro comunitário
 *               lotacao_maxima:
 *                 type: integer
 *                 description: Lotação máxima do centro comunitário
 *               recursos:
 *                 type: object
 *                 description: Recursos disponíveis no centro comunitário
 *             required:
 *               - nome
 *               - rua
 *               - numero
 *               - bairro
 *               - cidade
 *               - lotacao_atual
 *               - lotacao_maxima
 *     responses:
 *       201:
 *         description: Centro comunitário registrado com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', centroComunitarioController.registerCentro);

/**
 * @swagger
 * /centroComunitario/lotacao/{id}:
 *   post:
 *     summary: Atualizar lotação atual do centro comunitário
 *     tags: [Centro Comunitário]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do centro comunitário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               novaLotacao:
 *                 type: integer
 *                 description: Nova lotação do centro comunitário
 *             required:
 *               - novaLotacao
 *     responses:
 *       200:
 *         description: Lotação atualizada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/lotacao/:id', centroComunitarioController.updateLotacao);

/**
 * @swagger
 * /centroComunitario/exchange:
 *   post:
 *     summary: Trocar recursos entre centros comunitários
 *     tags: [Centro Comunitário]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               centroId1:
 *                 type: string
 *                 description: ID do primeiro centro comunitário
 *               centroId2:
 *                 type: string
 *                 description: ID do segundo centro comunitário
 *               recursos1:
 *                 type: object
 *                 description: Recursos do primeiro centro comunitário
 *               recursos2:
 *                 type: object
 *                 description: Recursos do segundo centro comunitário
 *             required:
 *               - centroId1
 *               - centroId2
 *               - recursos1
 *               - recursos2
 *     responses:
 *       200:
 *         description: Recursos trocados com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/exchange', centroComunitarioController.exchangeRecursos);

module.exports = router;
