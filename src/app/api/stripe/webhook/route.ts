import stripe from "@/app/lib/stripe";
import { handleStripeCancelSubscription } from "@/app/server/stripe/handle-cancel";
import { handleStripePayment } from "@/app/server/stripe/handle-payment";
import { handleStripeSubscription } from "@/app/server/stripe/handle-subscription";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

const secret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    const body = await req.text();
    
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if(!signature || !secret) {
        return new Response("Missing signature or secret", { status: 400 });
    }

    try {
        const event = stripe.webhooks.constructEvent(body, signature, secret);

        switch (event.type) {
            case "checkout.session.completed": // Pagamento realizado se status == paid
                const metadata = event.data.object.metadata;
    
                if(metadata?.price === process.env.STRIPE_PRODUCT_PRICE_ID)
                    await handleStripePayment(event);
    
                if(metadata?.price === process.env.STRIPE_SUBSCRIPTION_PRICE_ID)
                    await handleStripeSubscription(event);
                break;
            case "checkout.session.expired": // Expirou o tempo de pagamento 
                break;
            case "checkout.session.async_payment_succeeded": // Boleto pago
                break;
            case "checkout.session.async_payment_failed": // Boleto falhou
                break;
            case "customer.subscription.created": // Criou a assinatura
                break;
            case "customer.subscription.updated": // Atualizou a assinatura
                break;
            case "customer.subscription.deleted": // Cancelou a assinatura
                await handleStripeCancelSubscription(event);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
                break;
        }

        return new Response("Webhook received", { status: 200 });
    } catch (error) {
        console.error("Error handling Stripe webhook", error);
        return new Response("Webhook Error", { status: 500 });
    }
}