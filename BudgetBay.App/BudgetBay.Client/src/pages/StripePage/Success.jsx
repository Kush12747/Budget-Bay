import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function Sucess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (sessionId) {
            axios.get(`http://localhost:5173/success?session_id=${sessionId}`)
            .then(res => console.log("Payment verified:", res.data))
            .catch(err => console.error(err));
        }
    }, [sessionId]);

    return <h2>Payment Successful!</h2>;
}