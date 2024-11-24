import Xrp from "@ledgerhq/hw-app-xrp";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

export async function handleLogin() {
  try {
    const transport = await TransportWebUSB.create();
    const ledgerInstance = new Xrp(transport);
    const address = await ledgerInstance.getAddress("44'/144'/0'/0/0")
    return address
  } catch (e) {
    console.error(e)
    alert("Error connecting to Ledger Device!")
  }
}

export const handleLogOut = async () => {
  return true
}

export const getAccount = async () => {
  return ''
}

export const getAppName = async () => {
  return ''
}

export const signTransaction = async (transaction: any, return_url: string|null|undefined) => {
  return true
}

export const getInfoTransaction = async (uuid: string) => {
  return true
}