import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51SMtOtPIbNQkJgWNzjnrrLsOVEGS61NLROtrSYFA2t9h4GqFtCRMQIjMMEf307BVyqjXjFYiEXc8w3wusYaoHhli008AmJgogX");

export default function StripeProvider({ children }) {
    return <Elements stripe={stripePromise}>{children}</Elements>;
}