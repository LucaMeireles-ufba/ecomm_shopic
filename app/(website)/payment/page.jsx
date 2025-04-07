'use client';
import { useEffect, useState } from 'react';
import { GeneratePayment } from './actions';

export default function PaymentPage() {
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');
    const [showPaymentComponent, setShowPaymentComponent] = useState(true);

    useEffect(() => {
        const fetchPaymentUrl = async () => {
            const storedPrice = localStorage.getItem('price');
            const storedUsername = localStorage.getItem('name');
            if (storedPrice) setPrice(parseFloat(storedPrice));
            if (storedUsername) setName(storedUsername);

            if (storedPrice && storedUsername) {
                try {
                    const responseAPI = await GeneratePayment(storedPrice, storedUsername);
                    console.log(responseAPI);
                    setPaymentUrl(responseAPI);
                } catch (error) {
                    console.error('Error generating payment:', error);
                }
            }
        };

        fetchPaymentUrl();
    }, []);

    const handleRedirectToPayment = () => {
        console.log('Redirecionando para o pagamento:', paymentUrl);
        if (paymentUrl) {
            window.location.href = paymentUrl; // Redirect to the payment URL
        }
    };

    return (
        <div style={{ height: '70vh' }}>
            {showPaymentComponent && paymentUrl && (
                <>
                    <h1>{name}, pague R${price.toFixed(2)} via AbacatePay</h1>
                    <button
                        onClick={handleRedirectToPayment}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Ir para o pagamento
                    </button>
                </>
            )}
            {!showPaymentComponent && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <p>
                        <strong style={{ color: 'green' }}>Pagamento criado com sucesso!</strong>
                    </p>
                </div>
            )}
        </div>
    );
}
