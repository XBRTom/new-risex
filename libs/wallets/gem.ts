import {
    isInstalled,
    signTransaction as signTransactionGem,
    getPublicKey,
    getAddress as getAddressGem,
    getNetwork as getNetworkGem,
  } from "@gemwallet/api";
  import { verifySignature } from "xrpl";
  
  export const handleLogin = async () => {
    const gemWalletInstalled = await isInstalled();
    return gemWalletInstalled.result.isInstalled;
  };

  export const handleLogOut = async () => {
    return true;
  };
  
  export const signTransaction = async (transaction: any, return_url: string|null|undefined) => {
    const signResult = await signTransactionGem({ transaction });
    return signResult.result?.signature ?? null;
  };
  
  export const getAddress = async () => {
    const address = await getAddressGem();
    return address.result?.address ?? null;
  };
  
  export const getNetwork = async () => {
    const network = await getNetworkGem();
    return network.result?.websocket ?? '';
  };

  export const getAccount = async () => {
    const address = await getAddressGem();
    return address.result?.address ?? null;
  }
  
  export const getAppName = async () => {
    return 'LiquidX'
  }
  
  export const validateSignedTransactionResult = async (
    signedTransactionResult: any
  ) => {
    const publicKey = await getPublicKey();
  
    if (!publicKey.result) return;
  
    return verifySignature(signedTransactionResult, publicKey.result.publicKey);
  }

  export const getInfoTransaction = async (uuid: string) => {
    return true
  }