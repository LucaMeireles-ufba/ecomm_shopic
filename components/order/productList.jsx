import Image from 'next/image'
import { ref, getDownloadURL, list } from "@firebase/storage";
import { storage } from "@/firebase";
import React, { useState } from 'react'

const ProductList = ({ name, size = '', price, productId, quantity }) => {
    const[firstProductUrl, setFirstProductUrl] = useState('');
    
    const getFirstImageFromFolder = async (productId) => {
        try {
            const folderPath = String(productId);
            const folderRef = ref(storage, folderPath);
            const items = await list(folderRef);

            if (items.items.length > 0) {
                const firstItemRef = items.items[0];
                const downloadURL = await getDownloadURL(firstItemRef);
                setFirstProductUrl(downloadURL);
            }
        } catch (error) {
            console.error('Error getting the first image:', error);
        }
    };
    
    getFirstImageFromFolder(productId);
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between p-4 border-b gap-4">
                {firstProductUrl ? (
                    <Image
                        src={firstProductUrl}
                        width={100}
                        height={100}
                        alt={name}
                    />
                ) : (
                    <Image
                        src={'/static/images/default-image1.png'}
                        width={100}
                        height={100}
                        alt={name}
                    />
                )}

                <div className='flex flex-col items-center'>
                    <div className="text-lg font-semibold">{name}</div>
                    <div className="text-gray-500">Tamanho: {size}</div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-green-600">R$ {price.toFixed(2)}</div>
                    <div className="text-gray-500">Quantidade: {quantity}</div>
                </div>
            </div>
        </div>
    );
};

export default ProductList;
