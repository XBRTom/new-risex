import AmmInfo from '@/components/AmmInfo';

const PoolDetailPage = ({ params }: any) => {
    const account = params.account || '';
  return (
    <div>
      <AmmInfo account={account}/>
    </div>
  );
};

export default PoolDetailPage;
