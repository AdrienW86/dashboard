require('dotenv').config()
import Order from '@/models/order';
import { connectDb } from './db';

async function handler(req, res) {
   try {
    await connectDb()
    await Order.deleteMany({});
    console.log('Toutes les commandes ont été supprimées avec succès.');
  } catch (error) {
    console.error('Erreur lors de la suppression des commandes :', error);
    throw error;
  }
}

export default handler;