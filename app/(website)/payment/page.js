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

    const username = localStorage.getItem('name')

    const params = {
        version: "01",
        key: "86300844560", //or any PIX key
        name: username,
        city: "Salvador",
        transactionId: "202401",
        message: "SHOPIC",
        value: price
    };

    function showQrPix(context) {
        const pixQR = QrCodePix(context);
        pixQR.base64().then(setQrBase64);
    }

    return (
        <div>
            <h1>Pague R$ {price.toFixed(2)} via Pix</h1>
            <div className="App">
                <p>Código QR:</p>
                {showQrPix(params)}
                {qrBase64 ? <img src={qrBase64} alt="QR PIX" /> : <div>PIX INVALIDO</div>}
            </div>

        </div>
    );
}
