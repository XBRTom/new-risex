import { Xumm } from "xumm";
import apiClient from '../../libs/api'

const apiKey = process.env.NEXT_PUBLIC_XUMM_API_KEY || '';
const apiSecret = process.env.NEXT_PUBLIC_XUMM_API_SECRET || '';

const xumm = new Xumm(apiKey, apiSecret);

export const handleLogin = async () => {
    //const response = await signTransaction({TransactionType: "SignIn"});
    //return response.data?.refs?.qr_png ?? null;
    await xumm.authorize()
};

export const handleLoginTransaction = async () => {

}

export const getAccount = async () => {
    return xumm?.user?.account.then(a => a ?? '')
}

export const getAppName = async () => {
    return await xumm?.environment?.jwt?.then(j => j?.app_name ?? '') ?? ''
}

export const signTransaction = async (transaction: any, return_url: string|null|undefined) => {
    return await apiClient.post(`/account/wallets`, { transaction, return_url })
};

export const getInfoTransaction = async (uuid: string) => {
    return await apiClient.get(`/account/wallets/${uuid}`)
};

export const handleLogOut = async () => {
    await xumm.logout()
};