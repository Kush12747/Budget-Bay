import React, { useState } from 'react';
import axios from "axios";

export default function CheckoutButton({ productName, amount}) {
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/api/payments/create-checkout-session", {
                productName,
                amount
            });
            //Redirect to Stripe checkout
            window.location.href = response.data.url;
        } catch (error) {
            console.error(error);
            alert("Failed to create checkout session");
        } finally {
            setLoading(false);
        }
    };

    return ( 
        <button
            onClick={handleCheckout}
            disabled={loading}
            style={{
            padding: "12px 24px",
                backgroundColor: "#6772E5",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"  
            }}
        >
            {loading ? "Loading..." : `Pay $${amount}`}
        </button>
    );
}