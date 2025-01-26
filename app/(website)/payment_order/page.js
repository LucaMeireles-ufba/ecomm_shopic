'use server'
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const response = await fetch('https://api.mercadopago.com/v1/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Idempotency-Key': uuidv4(),
                    Authorization: `Bearer TEST-3973403335554418-112719-624ba5a31c10732aa16535db492a19db-2100006760`,
                },
                body: JSON.stringify({
                    payer: { email: 'victoremannuel1156@gmail.com' },
                    token: uuidv4(),
                    transaction_amount: req.body.price,
                }),
            });
            console.log(response.json());
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao criar pagamento', details: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Método ${req.method} não permitido`);
    }
}
