"use client"
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import { Fragment, useState, useEffect} from "react";
import Link from 'next/link'
import { ref, getDownloadURL, list } from "@firebase/storage";
import { storage } from "@/firebase";

export const CartItem = ({ item }) => {
  const { removeFromCart, updateCartItemQuantity } = useCart();
  const [qty, setQty] = useState(item.quantity)
  const [firstImageUrl, setFirstImageUrl] = useState('');

  useEffect(() => {
    const fetchFirstImage = async () => {
      try {
        const folderPath = String(item.product.id);
        const folderRef = ref(storage, folderPath);
        const items = await list(folderRef);

        if (items.items.length > 0) {
          const firstItemRef = items.items[0];
          const downloadURL = String(await getDownloadURL(firstItemRef));
          setFirstImageUrl(downloadURL);
        }
      } catch (error) {
        console.error('Error fetching the first image:', error);
      }
    };

    fetchFirstImage();
  }, [item.product.id]);


  const handleQuantityChange = (qty) => {
    const quantity = Number(qty);
    if (quantity >= 0) {
      updateCartItemQuantity(item.item.sku, quantity);
    }
  };

  const handleRemoveClick = () => {
    removeFromCart(item.item.sku);
  };

  function addQty() {
    handleQuantityChange(Math.min(qty + 1, item.item.amount))
    setQty(Math.min(qty + 1, item.item.amount))

  }

  function decQty() {
    if (qty > 0) {
      handleQuantityChange(qty - 1)
      setQty(qty - 1)
    }
  }

  return (
    <Fragment key={item.product.sku}>
      <Link href={`/product/${item.product.id}`}>
        <div className="flex justify-center">
          <Image width={100} height={100} alt="imagem" src={firstImageUrl || `/static/images/default-image1.png`} />
        </div>
      </Link>
      <div className="flex justify-start items-center">
        <div>
          <Link href={"/product/" + item.product.id}>
            <div className="inline-block">{item.product.name}</div><br />
            <div className="inline-block text-xs">{item.item.sku}</div><br />
            <div className="inline-block text-xs">Tamanho: {item.item.size}</div><br />
          </Link>
        </div>
      </div>
      <div className="text-lg flex-grow-0 flex flex-col justify-center items-center gap-2">
        <div className="">
          <button onClick={decQty} className="bg-zinc-300 px-2 py-1 rounded-l-full">-</button>
          <input className="bg-zinc-300 px-1 py-1 text-center remove-arrow w-10" type="number" disabled value={qty}></input>
          <button onClick={addQty} className="bg-zinc-300 px-2 py-1 rounded-r-full">+</button>
        </div>
        <div className="inline-block text-xs text-red-400 cursor-pointer" onClick={handleRemoveClick}>Remover</div>
      </div>
      <div className="text-center self-center">R${item.item.price.toFixed(2)}</div>
      <div className="text-center self-center">R${(item.item.price * qty).toFixed(2)}</div>
    </Fragment>
  )
};
