import { loadStripe, Stripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export function useStripe(){
    const [stripe, setStringe] = useState<Stripe | null>(null);
    
    useEffect(() => {
        async function loadStripeAsync() {
            const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!);

            setStringe(stripeInstance);
        }
        
    loadStripeAsync();
    }, []);

    async function createPaymentStripeCheckout(checkoutData: any) {
        if(!stripe) return;
        
        try {
            const response = await fetch('/api/stripe/create-paycheckout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(checkoutData),
            });

            const data = await response.json();

            await stripe.redirectToCheckout({
                sessionId: data.id,
            });

        } catch (error) {
            console.error('Error creating checkout session:', error);
            return;
        }
    }
    
    return {
        createPaymentStripeCheckout
    }
}