const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Reemplaza con tu Access Token de Mercado Pago
const ACCESS_TOKEN = 'TEST-4956685064279616-120723-2cc3496e1005d9c568c581a4af6753d8-338732921';

app.use(express.json());

app.post('/create-preference', async (req, res) => {
    try {
        const response = await axios.post('https://api.mercadopago.com/checkout/preferences', {
            items: [
                {
                    title: 'Test Product',
                    unit_price: 100,
                    quantity: 1
                }
            ],
            back_urls: {
                success: 'yourapp://payment-success',
                failure: 'yourapp://payment-failure',
                pending: 'yourapp://payment-pending'
            },
            auto_return: 'approved'
        }, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        res.json({ init_point: response.data.init_point });
    } catch (error) {
        console.error('Error creating preference:', error);
        res.status(500).json({ error: 'Error creating preference' });
    }
});

// Ruta para manejar las notificaciones de Webhook
app.post('/webhook', async (req, res) => {
    try {
        console.log('Webhook received:', req.body); // Loguea el cuerpo de la solicitud
        const { type, data } = req.body;
        if (type === 'payment') {
            const paymentId = data.id;
            // Obtener información detallada del pago
            const paymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`
                }
            });
        
            console.log('Payment Information:', paymentInfo.data).status;
            // Aquí puedes manejar la información del pago, por ejemplo:
            // Guardar información en la base de datos, actualizar el estado del pedido, etc.
        }
        res.sendStatus(200); // Responder con un 200 OK a Mercado Pago
    } catch (error) {
        console.error('Error handling webhook:', error);
        res.sendStatus(500);
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
