import {
    ChannelType,
    Permissions,
    ChatInputCommandInteraction,
    PermissionResolvable,
    PermissionFlagsBits,
} from "discord.js"; // Import des classes nécessaires pour les commandes
import { ClientExtend } from "../types/clientExtend";
require("dotenv").config();

const soutsuId = process.env.SOUTSU_ID;

if (!soutsuId) throw new Error("L'ID de Soutsu est manquant !");

// Crée l'objet de perm pour loop dessus et check si le membre a les permissions
const objetPerm: {
    [key in Permissions]: string[];
} = {
    BanMembers: ["ban", "unban"],
    ManageMessages: ["blacklist", "clear"],
    KickMembers: ["kick"],
    ManageRoles: ["mute"],
    Administrator: [
        "repete",
        "role_choice",
        "settings",
        "validate_member",
        "vent",
        "role_description",
    ],
};

const objetPermissionResolvables: { [key: string]: PermissionResolvable } = {
    BanMembers: PermissionFlagsBits.BanMembers,
    ManageMessages: PermissionFlagsBits.ManageMessages,
    KickMembers: PermissionFlagsBits.KickMembers,
    ManageRoles: PermissionFlagsBits.ManageRoles,
    Administrator: PermissionFlagsBits.Administrator,
};

// Crée l'objet pour les commandes qui demandent des autorisations sur des subcommandes
const objetPermSubcommand: { [key: string]: string[] } = {
    vent: ["moderation"],
    role_description: ["modify", "remove"],
};

export const handleCommand = async (
    client: ClientExtend,
    interaction: ChatInputCommandInteraction
) => {
    const { commandName, options, channel, memberPermissions, user } =
        interaction;
    const command = client.commands?.get(commandName); // Récupère la commande exécutée

    if (!command) return; // Il ne fait rien si la commande est vide
    if (channel?.type === ChannelType.DM)
        return await interaction.reply({
            content:
                "Je ne peux pour l'instant pas réaliser de commandes en MP !",
            ephemeral: true,
        });

    //* Vérifie si l'utilisateur a les droits d'admin pour les commandes données
    // Boucle sur l'objet et vérifie si le membre n'a pas les permissions et que la commandes n'est pas dans la liste
    for (const [perm, liste_commandes] of Object.entries(objetPerm)) {
        if (
            !memberPermissions?.has(objetPermissionResolvables[perm]) &&
            liste_commandes.includes(commandName) &&
            (Object.keys(objetPermSubcommand).includes(commandName)
                ? objetPermSubcommand[commandName].includes(
                      //* Les cas particuliers peuvent fonctionner via SubcommandGroup ou Subcommand
                      (options.getSubcommandGroup() // On test s'il y a des subcommandgroup
                          ? options.getSubcommandGroup() // si oui, on envoie le nom du groupe
                          : options.getSubcommand()) ?? "STRING_GUARD"
                      // Si non, on envoie le nom de la subcommand
                  )
                : true)
        )
            return interaction.reply({
                content: `Tu n'as pas l'autorisation requise (${perm}) pour exécuter cette commande !`,
                ephemeral: true,
            });
    }

    //* Exécution de la commande, avec catch en cas d'erreur
    try {
        command.execute(interaction);
    } catch (error) {
        console.error(error);
        const soutsu = await client.users.fetch(soutsuId);
        await soutsu.send(
            `Une erreur a été rencontrée lors de l'utilisation de la commande ${commandName} par ${user.tag}.`
        );
        await interaction.reply({
            content:
                "Une erreur est survenue durant l'exécution de la commande. Un rapport d'erreur a été envoyé à mon développeur !",
            ephemeral: true,
        });
    }
};