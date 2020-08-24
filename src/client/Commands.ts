import { Discord, CommandNotFound, CommandMessage, Command } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { prefix } from '../Config';
import { ExtractValueFromObject } from 'jsonarraytools';

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
        fetch(`http://localhost/player/${message.args.player}/`)
        .then(res => res.json())
        .then(data => {
            const { badges, avatar, playerName } = data.playerInfo; 

            let Badges = ExtractValueFromObject(badges, 'description');
            
            Badges.forEach((badge) => {
                message.channel.send(new MessageEmbed()
                    .setColor('#34ebcf')
                    .setTitle(`${playerName}'s badges`)
                    .setThumbnail(`https://new.scoresaber.com${avatar}`)
                    .addFields(
                        {
                            name: `\u200B`,
                            value: `${badge}`
                        }
                    )
                );
            });
        });
    }

    @Command("recent :player") 
    private async getRecentPlayer(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}/recent`)
        .then(res => res.json())
        .then(data => {
            const { scores } = data;
            scores.forEach((score) => {
                message.channel.send(new MessageEmbed()
                    .setColor('#34ebcf')
                    .addFields(
                        {
                            name: `Song Name`,
                            value: `${score.songName}`
                        },
                        {
                            name: `Author`,
                            value: `${score.songAuthorName}`
                        },
                        {
                            name: 'Score',
                            value: `${score.score}/${score.maxScore}`
                        },
                        {
                            name: 'PP',
                            value: `${score.pp}`
                        }
                    )
                );
            });
        });
    }

    @Command("top :player")
    private async getTopPlayer(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}/top`)
        .then(res => res.json())
        .then(data => {
            const { scores } = data;
            scores.forEach((score) => {
                message.channel.send(new MessageEmbed()
                    .setColor('#34ebcf')
                    .addFields(
                        {
                            name: `Song Name`,
                            value: `${score.songName}`
                        },
                        {
                            name: `Author`,
                            value: `${score.songAuthorName}`
                        },
                        {
                            name: 'Score',
                            value: `${score.score}/${score.maxScore}`
                        },
                        {
                            name: 'PP',
                            value: `${score.pp}`
                        }
                    )
                );
            });
        });
    }

    @Command("players")
    private async getPlayers(message: CommandMessage) {
        fetch(`http://localhost/players`)
        .then(res => res.json())
        .then(data => {
            const { players } = data;
            players.forEach((player) => {
                message.channel.send(new MessageEmbed()
                    .setColor('#34ebcf')
                    .setThumbnail(`https://new.scoresaber.com${player.avatar}`)
                    .addFields(
                        {
                            name: `Player Name`,
                            value: `${player.playerName}`
                        },
                        {
                            name: `Rank`,
                            value: `${player.rank}`
                        },
                        {
                            name: `Country`,
                            value: `${player.country}`
                        },
                        {
                            name: `PP`,
                            value: `${player.pp}`
                        }
                    )
                )
            });
        });
    }
}