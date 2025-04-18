import { db } from '@/app/lib/firebase';
import 'server-only';

import Stripe from "stripe";

export async function handleStripeCancelSubscription(event: Stripe.CustomerSubscriptionDeletedEvent){
    const customer = event.data.object.customer;
    const userRef = await db.collection("users").where("stripeCustomerId", "==", customer).get();

    if(userRef.empty) {
        console.error("User not found for customer ID:", customer);
        return;
    }

    const userId = userRef.docs[0].id;

    if(!userId) {
        console.error("User ID not found in metadata");
        return;
    }

    await db.collection("users").doc(userId).update({
        subscriptionStatus: "inactive",
    }); 

    console.log('Cancelou a assinatura!');
}