import { registerPlugin } from "@capacitor/core";

export interface GoogleAuthPlugin {
  signIn(options: {
    webClientId?: string;
  }): Promise<{ idToken: string; accessToken: string }>;
}
const GoogleAuthPlugin = registerPlugin<GoogleAuthPlugin>("GoogleAuth");

export default GoogleAuthPlugin;
