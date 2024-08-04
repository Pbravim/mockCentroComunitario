require('dotenv').config()
const notificationServiceUrl = process.env.URL_NOTIFICATION

const sendNotification = async (notification) => {
    try {
        const {centroId, centroNome, novaLotacao, lotacaoMaxima} = notification
        const payload = {
            message: `O centro ${centroId}, nome ${centroNome} de lotação maxima ${lotacaoMaxima}, tem ${novaLotacao} pessoas`
        }

        await axios.post(notificationServiceUrl, payload)
    } catch (e) {
        console.error('Erro ao enviar notificação:', e)
        throw new Error (e)
    }
}

module.exports = {
    sendNotification
}