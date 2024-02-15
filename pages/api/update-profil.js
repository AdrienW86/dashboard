import User from "@/models/user";
import { connectDb } from "./db";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const saltRounds = 10;

async function handler(req, res) {
    try {
        await connectDb();
        const { newPassword } = req.body;
        const { authorization } = req.headers;
        const token = authorization.replace('Bearer ', '');
        const decodedToken = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET || 'votre_clé_secrète');
        const userId = decodedToken.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe :", error.message);
        return res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" });
    }
}

export default handler;