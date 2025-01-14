'use client'

import { useState } from "react"

export default function ReadMore() {
    const [toggle, setToggle] = useState(false)

    function Toggle() {
        setToggle(!toggle)
    }

    return (
        <a className="cursor-pointer text-xs" onClick={(e, b) => {
            const p = e.target.parentElement.querySelector("p")

            if (!toggle) {
                if (window.expandedPReview) {
                    window.expandedPReview.style.maxHeight = null
                    window.expandedPReviewT(false)
                }
                p.style.maxHeight = p.scrollHeight + "px"
                window.expandedPReview = p
                window.expandedPReviewT = setToggle
            }
            else {
                p.style.maxHeight = null
                window.expandedPReview = null
            }
            setToggle(!toggle)

        }}>{!toggle ? "[+] continuar lendo" : "[- recolher]"}</a>
    )
}