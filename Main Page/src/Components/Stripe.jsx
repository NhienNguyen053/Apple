import { loadStripe } from '@stripe/stripe-js';

let stripePromise;
const getStripe = (pubKey) => {
    if (!stripePromise) {
        stripePromise = loadStripe(pubKey);
    }
    return stripePromise;
};

export default getStripe;