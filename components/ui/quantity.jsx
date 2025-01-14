'use client'

import { useState } from "react"

export default function Quantity() {
    const [qty, setQty] = useState(1)

    function addQty() {
        setQty(qty + 1)
    }

    function decQty() {
        setQty(qty - 1)
    }

    return (
        <div className="text-3xl flex-grow-0">
            <button onClick={decQty} className="bg-zinc-300 px-4 py-4 rounded-l-full">-</button>
            <input className="bg-zinc-300 px-4 py-4 text-center remove-arrow w-20" type="number" disabled value={qty}></input>
            <button onClick={addQty} className="bg-zinc-300 px-4 py-4 rounded-r-full">+</button>
        </div>
    )

}