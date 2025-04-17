import Stripe from 'stripe';

if(!process.env.STRIPE_SECRET_KEY)
    throw new Error('Missing Stripe secret key in environment variables');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-03-31.basil',
});

export default stripe;