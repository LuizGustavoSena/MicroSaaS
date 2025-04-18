"use client"

import { useStripe } from "@/app/hooks/useStripe";

export default function Pagamentos() {
    const { 
        createPaymentStripeCheckout,
        createSubscriptionStripeCheckout,
        handleCreateStripePortal
    } = useStripe();

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Pagamentos</h1>
            <button 
                className="border rounded-md px-1" 
                onClick={() => createPaymentStripeCheckout({testId: '123'})}
            >
                Criar pagamento stripe
            </button>
            <button 
                className="border rounded-md px-1"
                onClick={() => createSubscriptionStripeCheckout({testId: '123'})}
            >
                Criar assinatura stripe
            </button>
            <button 
                className="border rounded-md px-1"
                onClick={handleCreateStripePortal}
            >
                Criar portal de Pagamentos
            </button>
        </div>
    );
}