import apiClient from '../../libs/api'

// Get browser XUMM instance
function getXummInstance() {
  if (typeof window === 'undefined') {
    throw new Error('XUMM browser SDK only available in browser environment');
  }
  
  const xumm = (window as any).xumm;
  if (!xumm) {
    throw new Error('XUMM browser SDK not loaded. Make sure the script is loaded first.');
  }
  
  return xumm;
}

export const handleLogin = async () => {
    const xumm = getXummInstance();
    return await xumm.authorize();
};

export const handleLoginTransaction = async () => {

}

export const getAccount = async () => {
    const xumm = getXummInstance();
    return xumm?.user?.account.then(a => a ?? '')
}

export const getAppName = async () => {
    const xumm = getXummInstance();
    return await xumm?.environment?.jwt?.then(j => j?.app_name ?? '') ?? ''
}

export const signTransaction = async (transaction: any, return_url: string|null|undefined) => {
    return await apiClient.post(`/account/wallets`, { transaction, return_url })
};

export const getInfoTransaction = async (uuid: string) => {
    return await apiClient.get(`/account/wallets/${uuid}`)
};

export const handleLogOut = async () => {
    const xumm = getXummInstance();
    await xumm.logout()
};
