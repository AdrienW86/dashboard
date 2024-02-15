require('dotenv').config()
import Order from "@/models/order";
import jwt from 'jsonwebtoken';
import { connectDb } from "./db";

async function handler(req, res) {
  
    try {
        await connectDb()
        const { authorization } = req.headers;
    
       const index = req.body
    
        if (!authorization) {
          return res.status(401).json({ error: 'Token manquant' });
        }
      
        const token = authorization.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'votre_clé_secrète');
      
      // Mettre à jour le statut de la commande dans la base de données
      const statusItem = await Order.find();

     const item = statusItem[index]
  
      if (!item) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }
     


      if (item !== -1) {
        item.status = "Prêt à l'envoi";
      }  else {
        return res.status(404).json({ error: 'Article non trouvé' });
      }
  
      // Sauvegardez les modifications
      await item.save();
  
      // Renvoyez les données mises à jour de l'article
      res.status(200).json(item);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la commande :", error);
      return res.status(500).json({ error: "Erreur interne du serveur lors de la mise à jour du statut de la commande" });
    }
}

export default handler;