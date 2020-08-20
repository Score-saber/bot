import { Discord, CommandNotFound, CommandMessage } from '@typeit/discord';

@Discord()
export default class Commands {
    @CommandNotFound()
    private async commandNotFound(message: CommandMessage) {}
}