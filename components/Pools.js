'use client'

import React, { useEffect, useState } from 'react';
import PoolsTable from '@/components/PoolsTable';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import AddLiquidityModal from '@/components/AddLiquidityModal';
import WithdrawLiquidityModal from '@/components/WithdrawLiquidityModal';
import apiClient from '@/libs/api';

const Pools = () => {
  const [pools, setPools] = useState([]);
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPools, setFilteredPools] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  // const [wellKnownNames, setWellKnownNames] = useState([]);
  const [showAddLiquidityModal, setShowAddLiquidityModal] = useState(false);
  const [showWithdrawLiquidityModal, setShowWithdrawLiquidityModal] = useState(false);
  const [selectedPool, setSelectedPool] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPage = parseInt(localStorage.getItem('currentPage'), 10);
      if (!isNaN(storedPage)) {
        setCurrentPage(storedPage);
      }
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    const fetchAllPoolsData = async () => {
      try {
        setLoading(true);

        // Check if data exists in localStorage
        const cachedPools = localStorage.getItem('poolsData');
        const cachedExchangeRates = localStorage.getItem('exchangeRatesData');

        // if (cachedPools && cachedExchangeRates) {
        //   const parsedPools = JSON.parse(cachedPools);
        //   const parsedExchangeRates = JSON.parse(cachedExchangeRates);

        //   setPools(parsedPools);
        //   setFilteredPools(parsedPools);
        //   setExchangeRates(parsedExchangeRates);
        //   setTotalItems(parsedPools.length);

        //   // Fetch volume data based on cached pools
        //   await fetchVolumeData(parsedPools);

        // } else {
          // Fetch all pools data without pagination
          const data = await apiClient.get(`/fetch-pools/${1100}`);
          console.log('Fetched Pools:', data); // Log the pools directly after fetching
          const { pools } = data;
          // console.log('Fetched Pools:', pools); // Log the pools directly after fetching

          

          // Store fetched data in state
          setPools(pools);
          setFilteredPools(pools);
          setTotalItems(pools.length);

          // Save the fetched data to localStorage
          localStorage.setItem('poolsData', JSON.stringify(pools));
        // }

      } catch (err) {
        console.error('Failed to fetch initial data:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllPoolsData();
  }, []);

  useEffect(() => {
    if (!isInitializing && typeof window !== 'undefined') {
      localStorage.removeItem('currentPage');
      localStorage.setItem('currentPage', currentPage);
    }
  }, [currentPage, isInitializing]);

  

  useEffect(() => {
    setFilteredPools(pools.filter(pool =>
      (pool.account && pool.account.includes(searchQuery)) ||
      `${pool.asset_currency} / ${pool.asset2_currency}`.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [searchQuery, pools]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // const getCurrencyName = useCallback((currency, issuer) => {
  //   if (/^[0-9A-F]{10,45}$/i.test(currency)) {
  //     const wellKnown = wellKnownNames.find(item => item.account === issuer);
  //     return wellKnown ? wellKnown.name : currency;
  //   }
  //   return currency;
  // }, [wellKnownNames]);

  const handleAddLiquidityClick = (pool) => {
    setSelectedPool(pool);
    setShowAddLiquidityModal(true);
  };

  const handleCloseAddLiquidityModal = () => {
    setShowAddLiquidityModal(false);
    setSelectedPool(null);
  };

  const handleWithdrawLiquidityClick = (pool) => {
    setSelectedPool(pool);
    setShowWithdrawLiquidityModal(true);
  };

  const handleCloseWithdrawLiquidityModal = () => {
    setShowWithdrawLiquidityModal(false);
    setSelectedPool(null);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Loading...</h1>
          <p className="mt-2 text-lg">Please wait while we fetch the data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-16 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-light text-left text-white">Liquidity Pools</h3>
        <SearchBar handleSearch={handleSearch} />
      </div>
      <PoolsTable 
        pools={filteredPools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
        exchangeRates={exchangeRates} 
        onAddLiquidityClick={handleAddLiquidityClick} 
        onWithdrawLiquidityClick={handleWithdrawLiquidityClick} 
      />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems} // Use the totalItems state here
        paginate={paginate}
      />
      {showAddLiquidityModal && (
        <AddLiquidityModal pool={selectedPool} closeModal={handleCloseAddLiquidityModal} />
      )}
      {showWithdrawLiquidityModal && (
        <WithdrawLiquidityModal pool={selectedPool} closeModal={handleCloseWithdrawLiquidityModal} />
      )}
    </div>
  );
};

export default Pools;
