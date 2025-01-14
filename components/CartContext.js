"use client"

import { createContext, useContext, useEffect, useState, useTransition } from "react"
import { toast } from "react-toastify"
import { getProductsFromIds } from "../app/(website)/cart/actions"

const CartContext = createContext({
  cartItems: [],
  addToCart: () => { },
  removeFromCart: () => { },
  updateCartItemQuantity: () => { },
  cartTotal: 0,
  cartCount: 0,
  clearCart: () => {}
})

export const useCart = () => {
  
  return useContext(CartContext)
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    loadCart()
  }, [])

  useEffect(() => {
    if (loaded && !isPending)
      saveCart()
  }, [cartItems])

  const addToCart = (sku, product, qty = 1, silent = false) => {
    let found = false
    for (let i = 0; i < product.product_item.length; i++) {
      const item  = product.product_item[i];
      if (item.sku == sku)
        found = item
    }
    if (!found) {
      toast.error("Selecione um SKU primeiro")
      return null
    }
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.item.sku === sku
    )
    if (existingCartItemIndex !== -1) {
      const existingCartItem = cartItems[existingCartItemIndex]
      const updatedCartItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + qty,
      }
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingCartItemIndex] = updatedCartItem
      setCartItems(updatedCartItems)
    } else {
      setCartItems([...cartItems, { product: product, item: found, quantity: qty }])
    }
    if (!silent)
      toast.success(qty + "x " + product.name + " adicionado ao carrinho")
  }

  const addAllToCart = (products) => {
    const updatedCartItems = [...cartItems]
    products.forEach((el) => {

      const existingCartItemIndex = cartItems.findIndex(
        (item) => item.item.sku === el.item.sku
      )
      if (existingCartItemIndex !== -1) {
        const existingCartItem = cartItems[existingCartItemIndex]
        const updatedCartItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + el.quantity,
        }
        updatedCartItems[existingCartItemIndex] = updatedCartItem
      } else {
        updatedCartItems.push({ product: el.product, quantity: el.quantity, item: el.item })
      }
    })
    setCartItems(updatedCartItems)
  }

  const removeFromCart = (sku) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.item.sku !== sku
    )
    setCartItems(updatedCartItems)
  }

  const clearCart = () => {
    setCartItems([])
  }

  const updateCartItemQuantity = (sku, quantity) => {
    const existingCartItemIndex = cartItems.findIndex(
      (item) => item.item.sku === sku
    )
    if (existingCartItemIndex !== -1) {
      const existingCartItem = cartItems[existingCartItemIndex]
      const updatedCartItem = {
        ...existingCartItem,
        quantity,
      }
      const updatedCartItems = [...cartItems]
      updatedCartItems[existingCartItemIndex] = updatedCartItem
      setCartItems(updatedCartItems)
    }
  }

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.item.price * item.quantity,
    0
  )

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0)

  const saveCart = () => {
    if (localStorage) {
      let obj = []
      cartItems.forEach((el) => {
        obj.push({ id: el.product.id, quantity: el.quantity, sku: el.item.sku })
      })
      localStorage.setItem('cartItems', JSON.stringify(obj))
    }
  }

  function orderBySize(a,b){
    // Comparar pelo campo 'name'
    if (a.product.name < b.product.name) {
      return -1;
    } else if (a.product.name > b.product.name) {
        return 1;
    } else {
        // Se os nomes são iguais, comparar pelos tamanhos 'P', 'M', 'G'
        const tamanhoOrder = { 'PP': 1,'P': 2, 'M': 3, 'G': 4, 'GG': 5 };
        const tamanhoA = tamanhoOrder[a.item.size];
        const tamanhoB = tamanhoOrder[b.item.size];

        return tamanhoA - tamanhoB;
    }
  }

  const loadCart = () => {
    if (localStorage) {
      let loaded = localStorage.getItem('cartItems')
      if (loaded) {
        loaded = JSON.parse(loaded)
        let ids = []
        loaded.forEach((el) => {
          ids.push(el.id)
        })
        if (ids.length > 0) {
          startTransition(() => {
            getProductsFromIds(ids).then((data) => {
              const toAdd = []
              data.forEach((el) => {
                for (let i = 0; i < loaded.length; i++) {
                  for (let k = 0; k < el.product_item.length; k++) {
                    const element = el.product_item[k];
                    if (loaded[i].sku == element.sku) {
                      toAdd.push({ product: el, quantity: loaded[i].quantity, item: element })
                    }
                  }
                }
              })
              toAdd.sort(orderBySize)
              addAllToCart(toAdd)
            }).finally(() => {
              setLoaded(true)
            })
          })
        } else {
          setLoaded(true)
        }
      } else {
        setLoaded(true)
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        cartTotal,
        cartCount,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
