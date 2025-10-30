import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const Success = () => {
  const [searchParams] = useSearchParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await axios.get(`http://localhost:5192/api/payments/session/${sessionId}`);
        setSession(response.data);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  if (loading) return <div>Loading payment confirmation...</div>;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>✅ Payment Successful!</h1>
      <p>Thank you for your purchase.</p>
      {session && (
        <>
          <p><strong>Product:</strong> {session.displayItems?.[0]?.custom?.name}</p>
          <p><strong>Amount:</strong> ${(session.amount_total / 100).toFixed(2)}</p>
          <p><strong>Payment Status:</strong> {session.payment_status}</p>
        </>
      )}
      <a href="/" style={{ marginTop: '1rem', display: 'inline-block' }}>Go back to home</a>
    </div>
  );
};

export default Success;
