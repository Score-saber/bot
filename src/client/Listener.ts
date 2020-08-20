import { Discord, Once, ArgsOf } from '@typeit/discord';
import Client from './ScoreSaberBot';

@Discord()
export default class Listener {
    @Once("ready")
    private async onReady([]: ArgsOf<"ready">, client: Client) {
        console.log(`Bot online`);
    }
}