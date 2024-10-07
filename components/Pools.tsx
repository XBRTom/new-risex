'use client'

import React, { useEffect, useState, useRef } from 'react';
import PoolsTable from '@/components/PoolsTable';
import Pagination from '@/components/Pagination';
import SearchBar from '@/components/SearchBar';
import apiClient from '@/libs/api';

interface Pool {
  id: number;
  account: string;
  asset_currency: string;
  asset2_currency: string;
  balance: number;
  tradingFee: number;
  baseVolume: number;
  counterVolume: number;
  targetCurrency1: string;
  rate1: number;
  rate2: number;
  targetCurrency2: string;
  totalPoolVolume: string;
  feesGenerated: string;
  relativeAPR: string;
  grossAPR: string;
  totalValueLocked: string;
  poolYield: string;
  date: string;
}

const Pools: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPools, setFilteredPools] = useState<Pool[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const hasFetchedData = useRef<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPage = parseInt(localStorage.getItem('currentPage') || '1', 10);
      if (!isNaN(storedPage)) {
        setCurrentPage(storedPage);
      }
      setIsInitializing(false);
    }
  }, []);

  useEffect(() => {
    const fetchAllPoolsData = async () => {
      if (hasFetchedData.current) return;
      hasFetchedData.current = true;
      try {
        setLoading(true);
        const currentDate = new Date().toISOString().split('T')[0];
        const cachedPools = localStorage.getItem(`poolsData_${currentDate}`);
        if (!cachedPools) {
          const data: any = await apiClient.get(`/fetch-pools/${1100}`);
          const { pools, totalPools } = data;
          setPools(pools);
          setFilteredPools(pools);
          setTotalItems(totalPools);
          localStorage.setItem(`poolsData_${currentDate}`, JSON.stringify(pools));
          return;
        }
        const parsedPools = JSON.parse(cachedPools);
        setPools(parsedPools);
        setFilteredPools(parsedPools);
        setTotalItems(parsedPools.length);
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
      localStorage.setItem('currentPage', currentPage.toString());
    }
  }, [currentPage, isInitializing]);

  useEffect(() => {
    setFilteredPools(pools.filter(pool =>
      (pool.account && pool.account.includes(searchQuery)) ||
      `${pool.asset_currency} / ${pool.asset2_currency}`.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [searchQuery, pools]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const paginate = (pageNumber: number) => {
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
      />
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        paginate={paginate}
      />
    </div>
  );
};

export default Pools;
