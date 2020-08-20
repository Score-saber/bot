import { Discord, CommandNotFound, CommandMessage, Command } from '@typeit/discord';
import fetch from 'node-fetch';

@Discord("--!")
export default class Commands {
    @CommandNotFound()
    private async commandNotFound(message: CommandMessage) {}

    @Command("stats :player")
    private async getPlayer(message: CommandMessage) {
        fetch(`http://localhost/player/${message.args.player}`)
        .then(res => res.json())
        .then(data => {
            
        });
    }
}