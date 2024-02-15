require('dotenv').config()
import Order from '@/models/order';
import { connectDb } from './db';

const stripe = require('stripe')(process.env.STRIPE_API);

async function handler(req, res) {
  try {

    await connectDb()

    const existingOrders = await Order.find();

    if (existingOrders.length > 0) {
      // Si des données existent, renvoyer les données existantes
      return res.status(200).json({ sessionsDetails: existingOrders });
    }

    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const sessionsDetails = [];

    for (const session of sessions.data) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      const totalPrice = session.amount_total / 100;

      const sessionDetail = {
        sessionId: session.id,
        lineItems: lineItems.data.map(item => item.description),
        customerDetails: session.customer_details,
        totalPrice: totalPrice, 
        status: "Non préparé"
      };

      const order = new Order(sessionDetail);
      const savedOrder = await order.save();
      sessionsDetails.push(savedOrder);
    }

    res.status(200).json({ sessionsDetails });
  } catch (error) {
    console.error('Error fetching payment sessions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;