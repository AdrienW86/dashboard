require('dotenv').config()
import Stat from '@/models/stat';
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
    console.log(req.body)
    // Recherchez tous les documents dans la collection Stats
    const allStats = await Stat.find();



    // Renvoyez toutes les statistiques trouvées
    res.status(200).json(allStats);

  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export default handler;
