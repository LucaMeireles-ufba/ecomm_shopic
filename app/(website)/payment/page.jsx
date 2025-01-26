'use client'
import { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { v4 as uuidv4 } from 'uuid';
import { GeneratePayment } from './actions';
import Image from 'next/image';

initMercadoPago('APP_USR-73520f5b-8869-4184-b9ec-5809e64941eb', {
    locale: 'pt-BR',
});

export default function PaymentPage() {
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const [preferenceId, setPreferenceId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [qrCodeCopyAndPaste, setQrCodeCopyAndPaste] = useState('');
    const [qrcodeBase64, setQrcodeBase64] = useState('');
    const [showPaymentComponent, setShowPaymentComponent] = useState(true);

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
                    Authorization: `Bearer TEST-3973403335554418-112719-624ba5a31c10732aa16535db492a19db-2100006760`,
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

    const handlePaymentSubmit = async (event) => {
        try {
            const emailPayer = event.formData.payer.email
            const paymentData = await GeneratePayment(price, emailPayer);
            setPaymentId(paymentData.id);
            setPaymentStatus(paymentData.status);
            setQrCodeCopyAndPaste(paymentData.point_of_interaction.transaction_data.qr_code);
            setQrcodeBase64(paymentData.point_of_interaction.transaction_data.qr_code_base64);
            setShowPaymentComponent(false);
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(qrCodeCopyAndPaste).then(() => {
        }).catch((error) => {
            console.error('Erro ao copiar o código Pix:', error);
        });
    };

    return (
        <div style={{ height: '70vh' }}>
            {preferenceId && showPaymentComponent && (
                <>
                    <h1>{name} pague R${price.toFixed(2)} via Pix</h1>
                    <Payment
                        initialization={{ amount: price, preferenceId }}
                        customization={{
                            paymentMethods: {
                                bankTransfer: 'all',
                            },
                        }}
                        onSubmit={handlePaymentSubmit}
                        onError={(error) => console.error('Erro no componente Payment:', error)}

                    />
                </>
            )}
            {!showPaymentComponent && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <p><strong style={{ color: 'green' }}>Pagamento criado com sucesso!</strong> </p>
                    <Image src={`data:image/png;base64,${qrcodeBase64}`} alt="QR Code" width={200} height={200} />
                    <label htmlFor="pixCopyPaste">Pix Copia e Cola:</label>
                    <input
                        id="pixCopyPaste"
                        type="text"
                        value={qrCodeCopyAndPaste}
                        readOnly
                        style={{ width: '80%', padding: '10px', margin: '10px 0', backgroundColor: 'whitesmoke', borderRadius: 1,width:"80vh" }}
                    />
                    <button
                        onClick={handleCopyToClipboard}
                        style={{
                            backgroundColor: '#007bff',
                            color: '#fff',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Copiar código
                    </button>
                </div>
            )}
        </div>
    );
}
