import { Discord, CommandNotFound, CommandMessage, Command } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
import { prefix } from '../Config';
import { ExtractValueFromObject } from 'jsonarraytools';

@Discord(prefix)
export default class Commands {
    @CommandNotFound()
    private async commandNotFound(message: CommandMessage) {}

    @Command("map :id")
    private async getMap(message: CommandMessage) {
        fetch(`http://localhost/map/${message.args.id}`)
        .then(res => res.json())
        .then(data => {
            const { easy, normal, hard, expert, expertPlus } = data.maps.metadata.difficulties;
            const { songName, songAuthorName, bpm } = data.maps.metadata;
            const { downloads, plays, upVotes, downVotes, rating } = data.maps.stats;
            const { coverURL } = data.maps;

            message.channel.send(new MessageEmbed()
                .setColor('#34ebcf')
                .setTitle(`${songName}`)
                .setAuthor(`${songAuthorName}`)
                .setThumbnail(`https://beatsaver.com${coverURL}`)
                .addFields(
                    {
                        name: 'Easy Mode',
                        value: `${easy}`,
                        inline: true
                    },
                    {
                        name: 'Normal Mode',
                        value: `${normal}`,
                        inline: true
                    },
                    {
                        name: 'Hard Mode',
                        value: `${hard}`,
                        inline: true
                    },
                    {
                        name: 'Expert Mode',
                        value: `${expert}`,
                        inline: true
                    },
                    {
                        name: 'Expert Plus Mode',
                        value: `${expertPlus}`,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: 'BPM',
                        value: `${bpm}`,
                        inline: true
                    },
                    {
                        name: 'Downloads',
                        value: `${downloads}`,
                        inline: true
                    },
                    {
                        name: 'Plays',
                        value: `${plays}`,
                        inline: true
                    },
                )
                .addFields(
                    {
                        name: 'Up votes',
                        value: `${upVotes}`,
                        inline: true
                    },
                    {
                        name: 'Down votes',
                        value: `${downVotes}`,
                        inline: true
                    },
                    {
                        name: '\u200B',
                        value: `\u200B`,
                        inline: true
                    },
                )
            );
        });
    }

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