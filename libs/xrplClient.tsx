import { Client } from 'xrpl';

/* 
  Mainnet
  WebSocket -> wss://s1.ripple.com

  Testnet
  WebSocket -> wss://s.altnet.rippletest.net:51233/

  Devnet
  WebSocket -> wss://s.devnet.rippletest.net:51233/
*/
class XRPLClient {
  private static instance: XRPLClient;
  private client: Client;
  private isConnected: boolean = false;

  private constructor() {
    this.client = new Client('wss://s.devnet.rippletest.net:51233/', {
      connectionTimeout: 10000,
    });
  }

  public static getInstance(): XRPLClient {
    if (!XRPLClient.instance) {
      XRPLClient.instance = new XRPLClient();
    }
    return XRPLClient.instance;
  }

  private async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      console.log('Connecting to XRPL Ledger...');
      await this.client.connect();
      this.isConnected = true;
      console.log('Connected to XRPL Ledger');
    }
  }

  public async getClient(): Promise<Client> {
    await this.ensureConnected();
    return this.client;
  }
}

export default XRPLClient;