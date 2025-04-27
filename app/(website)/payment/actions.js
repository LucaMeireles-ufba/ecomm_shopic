
"use server";
import { v4 as uuidv4 } from 'uuid';

export async function GeneratePayment(price, email) {
    try {
        const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Idempotency-Key': uuidv4(),
                Authorization: `Bearer APP_USR-3973403335554418-112719-85db27b22941e41d74741f7af6ed75c8-2100006760`,
            },
            body: JSON.stringify({
                payer: { email },
                token: uuidv4(),
                description: 'teste',
                transaction_amount: price,
                payment_method_id: 'pix',
            }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Pagamento criado:', data);
        return data;
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        throw error;
    }
}

