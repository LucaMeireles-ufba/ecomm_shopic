"use server";
import { v4 as uuidv4 } from 'uuid';
export async function GeneratePayment(price) {
    fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': uuidv4(),
            'Authorization': 'Bearer APP_USR-3973403335554418-112719-85db27b22941e41d74741f7af6ed75c8-2100006760',
        },
        body: JSON.stringify({
            payer: {
                email: 'victoremannuel12@gmail.com'
            },
            token: uuidv4(),
            description:"teste",
            transaction_amount: 12.34,
            payment_method_id: 'pix'
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // setPaymentId(data.id);
            // setPaymentStatus(data.status);
            console.log('Pagamento criado:', data);
        })
        .catch((error) => {
            console.error('Erro ao criar pagamento:', error);
        });
}