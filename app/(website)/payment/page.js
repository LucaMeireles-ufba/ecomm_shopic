'use client';
import { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { StatusScreen } from '@mercadopago/sdk-react';
import { v4 as uuidv4 } from 'uuid';
import {GeneratePayment} from './actions'
// Inicializar o Mercado Pago com a chave pública de teste
initMercadoPago('APP_USR-73520f5b-8869-4184-b9ec-5809e64941eb');

export default function PaymentPage() {
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [preferenceId, setPreferenceId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null); 
    const [paymentId, setPaymentId] = useState(null);


    useEffect(() => {
        const storedPrice = localStorage.getItem('price');
        const storedUsername = localStorage.getItem('name');

        if (storedPrice) setPrice(parseFloat(storedPrice));
        if (storedUsername) setName(storedUsername);

        if (storedPrice) {
            fetch('https://api.mercadopago.com/checkout/preferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Idempotency-Key': uuidv4(),
                    'Authorization': 'Bearer TEST-3973403335554418-112719-624ba5a31c10732aa16535db492a19db-2100006760',
                },
                body: JSON.stringify({
                    items: [
                        {
                            title: storedUsername || 'Produto',
                            quantity: 1,
                            currency_id: 'BRL',
                            unit_price: parseFloat(storedPrice),
                        },
                    ],
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setPreferenceId(data.id);
                })
                .catch((error) => {
                    console.error('Erro ao criar preferência:', error);
                });
        }
    }, []);

 
    const handleStatus = () => {
        const initialization = {
            paymentId: payment_id, // id do pagamento a ser mostrado
        };
        const onError = async (error) => {
            // callback chamado para todos os casos de erro do Brick
            console.log(error);
        };
        const onReady = async () => {
            /*
              Callback chamado quando o Brick estiver pronto.
              Aqui você pode ocultar loadings do seu site, por exemplo.
            */
        };
    };

    return (
        <div>
            <h1>{name} pague R${price.toFixed(2)} via Pix</h1>
            {preferenceId ? (
                <>
                    <Payment
                        initialization={{ amount: price, preferenceId }}
                        customization={{
                            paymentMethods: {
                                bankTransfer: 'all',
                            },
                        }}
                        onSubmit={async () => await GeneratePayment(price)}
                        onReady={() => console.log('Brick pronto')}
                        onError={(error) => console.error('Erro:', error)}
                    />
                </>
            ) : (
                <p>Carregando pagamento...</p>
            )}

            {paymentId && (
                <StatusScreen
                    initialization={handleStatus}
                    onReady={onReady}
                    onError={onError}
                />
            )}
        </div>
    );
}