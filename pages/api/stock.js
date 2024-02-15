require('dotenv').config()
import Stock from '@/models/stock';
import jwt from 'jsonwebtoken';
import { connectDb } from './db';

async function handler(req, res) {
  try {
    await connectDb();

    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = authorization.replace('Bearer ', '');
    const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'votre_clé_secrète');
    const userId = decodedToken.userId;
    const allStats = await Stock.find();

    res.status(200).json(allStats);

  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export default handler;