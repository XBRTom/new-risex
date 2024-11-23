import sdk from "@crossmarkio/sdk";

// handles connection to crossmark
export const handleLogin = async () => {
  const res = await sdk.async.signInAndWait();

  return res;
};

export const handleLogOut = async () => {
  
  return true;
};

export const getAccount = async () => {
  return ''
}

export const getAppName = async () => {
  return ''
}

export const signTransaction = async (transaction: any, return_url: string|null|undefined) => {
  const res = await sdk.async.signAndWait(transaction);

  return res.response.data.txBlob;
};