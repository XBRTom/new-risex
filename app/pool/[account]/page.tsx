//import AmmInfo from '@/components/AmmInfo';
import { fetchAmmInfo } from '@/libs/db';

const PoolDetailPage = async ({ params }: any) => {
    const account = params.account || '';
    const ammInfo = await fetchAmmInfo(account);
  return (
    <div>
      {/*<AmmInfo account={account} ammInfo={ammInfo}/>*/}
    </div>
  );
};

export default PoolDetailPage;
