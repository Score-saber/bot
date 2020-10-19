import { Discord, CommandNotFound, CommandMessage, Command } from '@typeit/discord';
import { MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';
const prefix = "--!";
import { ExtractValueFromObject } from 'jsonarraytools';

@Discord(prefix)
export default class Commands {
    @CommandNotFound()
    private async commandNotFound(message: CommandMessage) {
        try {
            message.channel.send(new MessageEmbed().setColor(`#34ebcf`).setTitle(`Unknown command!`));
        } catch(error) {
            throw error;
        }
    }

    @Command("map :id")
    private async getMap(message: CommandMessage) {
        try {
            fetch(`https://beatsaver.com/api/maps/by-hash/${message.args.id}`, { headers: { 'User-Agent': 'ScoreSaber/1.0.0' }})
            .then(res => res.json())
            .then(data => {
                const { easy, normal, hard, expert, expertPlus } = data.metadata.difficulties;
                const { songName, songAuthorName, bpm } = data.metadata;
                const { downloads, plays, upVotes, downVotes } = data.stats;
                const { coverURL } = data;
    
                message.channel.send(new MessageEmbed()
                    .setColor(`#34ebcf`)
                    .setTitle(`${songName}`)
                    .setAuthor(`${songAuthorName}`)
                    .setThumbnail(`https://beatsaver.com${coverURL}`)
                    .addFields(
                        { name: 'Easy Mode', value: `${easy}`, inline: true },
                        { name: 'Normal Mode', value: `${normal}`, inline: true },
                        { name: 'Hard Mode', value: `${hard}`, inline: true },
                        { name: 'Expert Mode', value: `${expert}`, inline: true },
                        { name: 'Expert Plus Mode', value: `${expertPlus}`, inline: true },
                    )
                    .addFields(
                        { name: 'BPM', value: `${bpm}`, inline: true },
                        { name: 'Downloads', value: `${downloads}`, inline: true },
                        { name: 'Plays', value: `${plays}`, inline: true },
                    )
                    .addFields(
                        { name: 'Up votes', value: `${upVotes}`, inline: true },
                        { name: 'Down votes', value: `${downVotes}`, inline: true },
                        { name: '\u200B', value: `\u200B`, inline: true },
                    )
                )
            });
        } catch(error) {
            throw error;
        }
    }

    @Command("stats :player")
    private async getPlayer(message: CommandMessage) {
        try {
            await fetch(`https://new.scoresaber.com/api/player/${message.args.player}/full`)
            .then(res => res.json())
            .then(data => {
                const { playerName, rank, avatar, pp, role } = data.playerInfo;
                const { averageRankedAccuracy, totalPlayCount } = data.scoreStats;

                message.channel.send(new MessageEmbed()
                    .setColor('#34ebcf')
                    .setTitle(`${playerName}'s stats`)
                    .setDescription(role)
                    .setThumbnail(`https://new.scoresaber.com${avatar}`)
                    .addFields(
                        { name: 'Accuracy', value: `${Math.round(averageRankedAccuracy)}%`, inline: true },
                        { name: 'Global Rank', value: rank, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true },
                    )
                    .addFields(
                        { name: 'Play Count', value: totalPlayCount, inline: true },
                        { name: 'PP', value: pp, inline: true },
                        { name: '\u200B', value: '\u200B', inline: true }
                    )
                )
            });
        } catch(error) {
            throw error;
        }
    }

    @Command("badges :player")
    private async getPlayerBadges(message: CommandMessage) {
        try {
            fetch(`https://new.scoresaber.com/api/player/${message.args.player}/full`)
            .then(res => res.json())
            .then(data => {
                const { badges, avatar, playerName } = data.playerInfo; 
    
                let Badges = ExtractValueFromObject(badges, 'description');
                
                Badges.forEach((badge) => {
                    message.channel.send(new MessageEmbed()
                        .setColor('#34ebcf')
                        .setTitle(`${playerName}'s badges`)
                        .setThumbnail(`https://new.scoresaber.com${avatar}`)
                        .addFields({ name: `\u200B`, value: `${badge}` })
                    );
                });
            });
        } catch(error) {
            throw error;
        }

    }

    @Command("recent :player") 
    private async getRecentPlayer(message: CommandMessage) {
        try {
            fetch(`https://new.scoresaber.com/api/player/${message.args.player}/scores/recent`)
            .then(res => res.json())
            .then(data => {
                const { scores } = data;
                scores.forEach((score) => {
                    message.channel.send(new MessageEmbed()
                        .setColor('#34ebcf')
                        .addFields(
                            { name: `Song Name`, value: `${score.songName}` },
                            { name: `Author`, value: `${score.songAuthorName}` },
                            { name: 'Score', value: `${score.score}/${score.maxScore}` },
                            { name: 'PP', value: `${score.pp}` }
                        )
                    );
                });
            });
        } catch(error) {
            throw error;
        }
    }

    @Command("top :player")
    private async getTopPlayer(message: CommandMessage) {
        try {
            fetch(`https://new.scoresaber.com/api/player/${message.args.player}/scores/top`)
            .then(res => res.json())
            .then(data => {
                const { scores } = data;
                scores.forEach((score) => {
                    message.channel.send(new MessageEmbed()
                        .setColor('#34ebcf')
                        .addFields(
                            { name: `Song Name`, value: `${score.songName}` },
                            { name: `Author`, value: `${score.songAuthorName}` },
                            { name: 'Score', value: `${score.score}/${score.maxScore}` },
                            { name: 'PP', value: `${score.pp}` }
                        )
                    );
                });
            });
        } catch(error) { 
            throw error;
        }
    }

    @Command("players")
    private async getPlayers(message: CommandMessage) {
        try {
            fetch(`https://new.scoresaber.com/api/players`)
            .then(res => res.json())
            .then(data => {
                const { players } = data;
                players.forEach((player) => {
                    message.channel.send(new MessageEmbed()
                        .setColor('#34ebcf')
                        .setThumbnail(`https://new.scoresaber.com${player.avatar}`)
                        .addFields(
                            { name: `Player Name`, value: `${player.playerName}` },
                            { name: `Rank`, value: `${player.rank}` },
                            { name: `Country`, value: `${player.country}` }, 
                            { name: `PP`, value: `${player.pp}` }
                        )
                    )
                });
            });
        } catch(error) {
            throw error;
        }
    }
}