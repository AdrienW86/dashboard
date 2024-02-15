require('dotenv').config();
import Stock from '@/models/stock';
import jwt from 'jsonwebtoken';
import { connectDb } from './db';

async function handler(req, res) {
  try {
    await connectDb();

    const { authorization } = req.headers;
    const { quantity, name } = req.body;
    
    if (!authorization) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'votre_clé_secrète');
    const userId = decodedToken.userId;

    // Recherchez le document Stock par le nom de l'article
    const stockItem = await Stock.findOne({ $or: [{ 'sockets.name': name }, { 'balms.name': name }] });
    
    if (!stockItem) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Mettez à jour la quantité de l'article dans le document Stock
    const sockIndex = stockItem.sockets.findIndex(sock => sock.name === name);
    const balmIndex = stockItem.balms.findIndex(balm => balm.name === name);
    
    if (sockIndex !== -1) {
      stockItem.sockets[sockIndex].quantity = quantity;
    } else if (balmIndex !== -1) {
      stockItem.balms[balmIndex].quantity = quantity;
    } else {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Sauvegardez les modifications
    await stockItem.save();

    // Renvoyez les données mises à jour de l'article
    res.status(200).json(stockItem);

  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export default handler;

