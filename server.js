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
                success: 'https://developer.chrome.com/docs/android/custom-tabs/guide-get-started?hl=es-419',
                failure: 'https://www.google.com/',
                pending: 'https://www.google.com/search?client=ubuntu-sn&channel=fs&q=como+configurar+mi+init+point+para+mercado+pagop'
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
