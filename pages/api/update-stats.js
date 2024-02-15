require('dotenv').config();
import Stat from '@/models/stat';
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
    const statItem = await Stat.findOne({ $or: [{ 'months.name': name }, { 'years.name': name }] });
    console.log(statItem)
    
    if (!statItem) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Mettez à jour la quantité de l'article dans le document Stock
    const monthIndex = statItem.months.findIndex(month => month.name === name);
    const yearIndex = statItem.years.findIndex(year => year.name === name);
    
    if (monthIndex !== -1) {
      statItem.months[monthIndex].quantity = quantity;
    } else if (yearIndex !== -1) {
      statItem.years[yearIndex].quantity = quantity;
    } else {
      return res.status(404).json({ error: 'Article non trouvé' });
    }

    // Sauvegardez les modifications
    await statItem.save();

    // Renvoyez les données mises à jour de l'article
    res.status(200).json(statItem);

  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export default handler;

