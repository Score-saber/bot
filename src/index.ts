import Client from './client/ScoreSaberBot';
import { token } from './Config';

const client: Client = new Client({ token });
client.start();