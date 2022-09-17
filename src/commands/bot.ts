import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot")
        .setDescription("Permet d'avoir les liens relatifs au bot aisément."),

    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setTitle("EduBot")
            .setDescription(
                "EduBot est un bot Discord réalisé principalement par RisingSunLight pour les 1ere année du BUT Informatique d'Ifs. Celui-ci est open source et est ouvert à tous ajouts de qualité."
            )
            .setFooter({ text: "Version 2.1.0" });

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setLabel("Repository du bot")
                .setURL("https://github.com/RisingSunLight42/EduBot")
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Signaler un bug")
                .setURL(
                    "https://github.com/RisingSunLight42/EduBot/issues/new?assignees=RisingSunLight42&labels=bug&template=rapport-de-bug.md&title=BUG"
                )
                .setStyle(ButtonStyle.Link),
            new ButtonBuilder()
                .setLabel("Demander un ajout")
                .setURL(
                    "https://github.com/RisingSunLight42/EduBot/issues/new?assignees=RisingSunLight42&labels=ajout&template=demande-d-ajout.md&title=AJOUT"
                )
                .setStyle(ButtonStyle.Link)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
            ephemeral: true,
        });
    },
};