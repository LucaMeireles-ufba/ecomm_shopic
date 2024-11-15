'use client';

import { useEffect, useState } from 'react';
import { QrCodePix } from "qrcode-pix";

export default function PaymentPage() {
    const [price, setPrice] = useState(0);
    const [qrBase64, setQrBase64] = useState("");

    useEffect(() => {
        const storedPrice = localStorage.getItem('price');
        if (storedPrice) setPrice(parseFloat(storedPrice));
    }, []);

    const params = {
        version: "01",
        key: "86300844560", //or any PIX key
        name: "Fulano de Tal",
        city: "SAO PAULO",
        transactionId: "202101",
        message: "MARIA APARECIDA DA SILVA SAURO E SOUZA MELO",
        // cep: '99999999',
        // countryCode: 'br',
        value: price
    };

    function showQrPix(context) {
        const pixQR = QrCodePix(context);
        pixQR.base64().then(setQrBase64);
    }

    return (
        <div>
            <h1>Payment Page</h1>
            <p>Price: R$ {price.toFixed(2)}</p>
            <div className="App">
                <h1>QR Project</h1>

                {showQrPix(params)}
                {qrBase64 ? <img src={qrBase64} alt="QR PIX" /> : <div>PIX INVALIDO</div>}
            </div>
        </div>
    );
}
