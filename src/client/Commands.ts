import { Discord, CommandNotFound, CommandMessage, Command } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { prefix } from '../Config';

@Discord(prefix)
export default class Commands {
    @CommandNotFound()
    private async commandNotFound(message: CommandMessage) {}

    @Command("stats :player")
    private async getPlayer(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}`)
        .then(res => res.json())
        .then(data => {
            const { playerName, rank, avatar, pp, role } = data.playerInfo;
            const { averageRankedAccuracy, totalPlayCount } = data.stats;

            message.channel.send(new MessageEmbed()
                .setColor('#34ebcf')
                .setTitle(`${playerName}'s stats`)
                .setDescription(role)
                .setThumbnail(`https://new.scoresaber.com${avatar}`)
                .addFields(
                    { name: 'Accuracy', value: `${Math.round(averageRankedAccuracy)}%`, inline: true },
                    { name: 'Global rank', value: rank, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true }
                )
                .addFields(
                    { name: 'Play Count', value: totalPlayCount, inline: true },
                    { name: 'PP', value: pp, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true }
                )
            )
        });
    }

    @Command("badges :player")
    private async getPlayerBadges(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}/badges`)
        .then(res => res.json())
        .then(data => {

        });
    }

    @Command("recent :player") 
    private async getRecentPlayer(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}/recent`)
        .then(res => res.json())
        .then(data => {

        });
    }

    @Command("top :palyer")
    private async getTopPlayer(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}/top`)
        .then(res => res.json())
        .then(data => {

        });
    }

    @Command("players")
    private async getPlayers(message: CommandMessage) {
        fetch(`http://localhost/players`)
        .then(res => res.json())
        .then(data => {

        });
    }
}