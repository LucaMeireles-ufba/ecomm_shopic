"use server";
import { v4 as uuidv4 } from 'uuid';

export async function GeneratePayment(price, email) {
    try {
        console.log('Criando pagamento...');
        console.log('Preço:', price);
        console.log('E-mail:', email);
        // Create a payment session with AbacatePay
        const options = {
            method: 'POST',
            headers: {
                Authorization: 'Bearer abc_dev_BAe2KjJ0fcNX3HQzsp04NbMF', // Replace with your API key
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                frequency: 'ONE_TIME',
                methods: ['PIX'],
                products: [
                    {
                        externalId: `prod-${uuidv4()}`,
                        name: email || 'Produto',
                        description: 'Pagamento único via Pix',
                        quantity: 1,
                        price: parseInt(parseFloat(price) * 100), // Convert to cents
                    },
                ],
                returnUrl: 'https://yourwebsite.com/payment-return', // Replace with your return URL
                completionUrl: 'https://yourwebsite.com/payment-completion', // Replace with your completion URL
                customer: {
                    name: email || 'Cliente',
                    cellphone: "(11) 4002-8922",
                    email: 'cliente@exemplo.com', // Replace with dynamic email if available
                    taxId: '245.313.790-55', // Replace with dynamic tax ID if available
                },
            }),
        };

        const response = await fetch('https://api.abacatepay.com/v1/billing/create', options)
            .then((response) => response.json())
            .catch((error) => {
                console.error('Erro ao criar pagamento:', error);
            });

        console.log('Pagamento criado:', response);
        return response.data.url;
    
    } catch (error) {
        console.error('Erro ao criar pagamento:', error);
        throw error;
    }
}


