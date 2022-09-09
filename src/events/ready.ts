import { deployGestion, recupFichier } from "../deployCommands"; // Importe la fonction pour déployer les commandes
import { ClientExtend } from "../helpers/types/clientExtend";
require("dotenv").config();

const guildOkoraId = process.env.GUILD_OKORA_ID;
const guildGestionId = process.env.GUILD_GESTION_ID;

if (!guildOkoraId || !guildGestionId)
    throw new Error("L'ID de Soutsu est manquant !");

module.exports = {
    name: "ready",
    once: true,
    execute(client: ClientExtend) {
        console.log(`🟢 Je suis allumée !`);

        //* Push les commandes suivant si les serveurs recherchés sont présents et si c'est le bot principal
        const liste_commandes = recupFichier();
        client.guilds.fetch().then(function (result) {
            const guild_liste_snowflake = result.map((objet) => objet.id); // Récupère les ids de guild du bot dans une liste
            if (guild_liste_snowflake.includes(guildGestionId)) {
                // S'il y a le serveur de gestion, push les commandes de gestion
                deployGestion(liste_commandes[0]);
            }
        });
    },
};
