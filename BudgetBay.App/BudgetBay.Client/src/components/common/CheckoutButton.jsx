// src/components/common/CheckoutButton.jsx
import axios from "axios";

const CheckoutButton = ({ productName, amount, currency = "usd" }) => {
  const handleCheckout = async () => {
    try {
      const response = await axios.post("http://localhost:5192/api/payments/create-checkout-session", {
        productName,
        amount,
        currency,
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        alert("Something went wrong: no URL returned");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to create a checkout page");
    }
  };

  return (
    <button
      onClick={handleCheckout}
      style={{
        backgroundColor: "#635bff",
        color: "#fff",
        padding: "12px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
      }}
    >
      Buy with Stripe
    </button>
  );
};

export default CheckoutButton;
