"use client";
import React, { useEffect, useState, useTransition } from 'react'
import { prisma } from '@/utils/prisma';
import  Sidebar  from "@/components/categories/Sidebar";
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { queryAllProducts, queryAllProductsPrice } from "../product/actions"
import { getHidePricesDB } from '../actionsSettings'
import { ref, getDownloadURL, list } from "@firebase/storage";
import { storage } from "@/firebase";

export default function Shop({searchParams}) {
  const [firstImageUrl, setFirstImageUrl] = useState([]);
	const [isPending,startTransition] = useTransition();
	const [products, setProducts] = useState([]);
  const [hidePrices, setHidePrices] = useState([]);

  let categoryId = searchParams?.categoryId ? parseInt(searchParams?.categoryId) : undefined
  const priceSearch = {}
  priceSearch.gte = searchParams?.minPrice ? parseFloat(searchParams?.minPrice) : undefined
  priceSearch.lte = searchParams?.maxPrice ? parseFloat(searchParams?.maxPrice) : undefined

  const getRandomDefaultImage = () => {
		const defaultImages = [
		  '/static/images/default-image1.png',
		  '/static/images/default-image2.png',
		  '/static/images/default-image3.png',
		];
		const randomIndex = Math.floor(Math.random() * defaultImages.length);
		return defaultImages[randomIndex];
	};

	const getFirstImageFromFolder = async (productId) => {
		try {
			const folderPath = String(productId);
			const folderRef = ref(storage, folderPath);
			const items = await list(folderRef);

			if (items.items.length > 0) {
			const firstItemRef = items.items[0];
			const downloadURL = await getDownloadURL(firstItemRef);
			return downloadURL;
			}
		} catch (error) {
			console.error('Error getting the first image:', error);
		}
	};
  
  const getPrice = async (products, hidePrices) => {
    if (hidePrices.value !== "true")
    products.forEach(product => {
      let max = 0, min = 999999999999
      product.product_item?.forEach(item => {
        if (item.amount > 0) {
          max = Math.max(max, item.price)
          min = Math.min(min, item.price)
        }
      });
      
      if (max == min)
        product.price = "R$" + max.toFixed(2)
      else if (max != 0)
        product.price = "R$" + min.toFixed(2) + " - R$" + max.toFixed(2)
      else
        product.price = "Indisponível"
    })
  }

  useEffect(() => {
		if(!isPending){
		  startTransition(async () => {
        console.log(categoryId, priceSearch);
        const products = await queryAllProductsPrice(categoryId, priceSearch);
        setProducts(products);

        const hidePrices = await getHidePricesDB()
        setHidePrices(hidePrices.value);
        getPrice(products, hidePrices);

        const imageUrls = await Promise.all(products.map((product) => getFirstImageFromFolder(product.id)));
        setFirstImageUrl(imageUrls);
      })
	  }
	},[,searchParams])

  
  return (
    <div className="px-8 w-full flex py-16">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="min-h-screen flex flex-col items-center justify-start gap-16 mx-4">
        {(categoryId && searchParams.categoryName) ? (
          <h1 className="text-2xl font-bold mb-4">{searchParams.categoryName.charAt(0).toUpperCase() + searchParams.categoryName.slice(1)}</h1>
        ) : (
          <h1 className="text-2xl font-bold mb-4">Todos os Produtos</h1>
        )}
        <div className="flex-1">
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-12 gap-x-8">
              {products.map((product, index) => (
                <Link href={"/product/" + product.id} key={product.id}>
                  <Card
                    key={product.id}
                    name={product.name}
                    image={firstImageUrl[index] || getRandomDefaultImage()}
                    price={hidePrices === 'true' ? null : product.price}
                    rating={product.rating}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <h1 className="mb-4 text-2xl font-semibold text-blue-500">Sem correspondência</h1>
                <p className="mb-4 text-lg text-gray-600">Oops! Não foram encontrados produtos com tais filtros.</p>
                <div className="animate-bounce">
                  <svg className="mx-auto h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </div>
                <p className="mt-4 text-gray-600">Deseja voltar à página inicial? <a href="/" className="text-blue-500">home</a>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  