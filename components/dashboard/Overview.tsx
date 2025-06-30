'use client'

import React, { useEffect, useState, useRef } from 'react';
import PoolsTable from '@/components/dashboard/overview/PoolsTable';
import Pagination from '@/components/dashboard/global/Pagination';
// import SearchBar from '@/components/SearchBar';
import apiClient from '@/libs/api';
import { Progress } from "@/components/ui/progress";
import Loader from '@/components/ui/Loader';
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Bar, BarChart } from "recharts";
// import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
// import { Package2, LayoutDashboard, Wallet, History, LogOut, Settings, File, Database, User, Sidebar } from "lucide-react";

// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";

import DashboardLayout from './layout/DashboardLayout';
import { AnyNaptrRecord } from 'dns';


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

const Dashboard: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<{ totalTVL: number; totalVolume: number; averageAPR: number }>({
    totalTVL: 0,
    totalVolume: 0,
    averageAPR: 0,
  });
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(15);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredPools, setFilteredPools] = useState<Pool[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  const hasFetchedData = useRef<boolean>(false);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state

  const truncateAddress = (address: string) => {
        return `${address.slice(0, 3)}...${address.slice(-6)}`;
      };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedPage = parseInt(localStorage.getItem('currentPage') || '1', 10);
      if (!isNaN(storedPage)) {
        setCurrentPage(storedPage);
      }
      setIsInitializing(false);
    }
  }, []);

  // Smart caching function
  const getCachedData = (page: number) => {
    const cacheKey = `pools_page_${page}_${itemsPerPage}`;
    const timestampKey = `${cacheKey}_timestamp`;
    
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTimestamp = localStorage.getItem(timestampKey);
    
    // Shorter cache time: 5 minutes for financial data
    const cacheExpirationTime = 5 * 60 * 1000; // 5 minutes
    
    if (cachedData && cachedTimestamp) {
      const isValid = (new Date().getTime() - new Date(cachedTimestamp).getTime()) < cacheExpirationTime;
      if (isValid) {
        console.log(`Using cached data for page ${page}`);
        return JSON.parse(cachedData);
      } else {
        console.log(`Cache expired for page ${page}, removing...`);
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(timestampKey);
      }
    }
    return null;
  };

  const setCachedData = (page: number, data: any) => {
    const cacheKey = `pools_page_${page}_${itemsPerPage}`;
    const timestampKey = `${cacheKey}_timestamp`;
    
    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(timestampKey, new Date().toISOString());
      console.log(`Cached data for page ${page}`);
    } catch (error) {
      console.warn('Failed to cache data:', error);
      // If localStorage is full, clear old cache
      clearOldCache();
    }
  };

  const clearOldCache = () => {
    console.log('Clearing old cache data...');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('pools_page_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  };

  // New function to fetch pools with smart caching
  const fetchPoolsData = async (page: number = 1) => {
    try {
      setLoading(true);
      
      // Check cache first
      const cachedData = getCachedData(page);
      if (cachedData) {
        const { pools, totalPools, currentPage, totalPages } = cachedData;
        setPools(pools);
        setFilteredPools(pools);
        setTotalItems(totalPools);
        setCurrentPage(currentPage);
        console.log(`Loaded ${pools.length} pools from cache (page ${currentPage}/${totalPages})`);
        setLoading(false);
        return;
      }
      
      console.log(`Fetching page ${page} with ${itemsPerPage} items per page`);
      
      const data: any = await apiClient.get(`/fetch-pools/${itemsPerPage}?page=${page}`);
      console.log('Fetched paginated data from API:', data);
      
      const { pools, totalPools, currentPage, totalPages, hasMore } = data;
      
      setPools(pools);
      setFilteredPools(pools);
      setTotalItems(totalPools);
      setCurrentPage(currentPage);
      
      // Cache the successful response
      setCachedData(page, { pools, totalPools, currentPage, totalPages });
      
      console.log(`Loaded ${pools.length} pools (page ${currentPage}/${totalPages})`);
      
    } catch (err) {
      console.error('Failed to fetch pools data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetchedData.current) {
      hasFetchedData.current = true;
      fetchPoolsData(currentPage);
    }
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

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  const paginate = (pageNumber: number) => {
    console.log(`Navigating to page ${pageNumber}`);
    setCurrentPage(pageNumber);
    hasFetchedData.current = false; // Allow refetch for new page
    fetchPoolsData(pageNumber);
  };

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const response = await apiClient.get('/pools-summary');
        setSummary({
          totalTVL: response.data.totalTVL,
          totalVolume: response.data.totalVolume,
          averageAPR: response.data.averageAPR,
        });
      } catch (error) {
        console.error('Failed to fetch summary data:', error);
      }
    };
    fetchSummaryData();
  }, []);

  return (
    <DashboardLayout>
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Beautiful Header */}
        <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800 bg-gradient-to-r from-gray-900/50 to-black/50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-semibold text-white">Liquidity Pools Overview</span>
            </div>
            <div className="text-sm text-gray-400">
              {totalItems} pools available
            </div>
          </div>
          <button
            onClick={() => fetchPoolsData(currentPage)}
            disabled={loading}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-gray-800 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader size={16} />
            ) : (
              <span>🔄</span>
            )}
            <span>Refresh</span>
          </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* Beautiful Summary Cards */}
          {!loading && pools.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-600/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-400">Total Pools</p>
                    <p className="text-2xl font-bold text-white">{totalItems.toLocaleString()}</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 text-xl">🏊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/20 to-green-600/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-400">Total TVL</p>
                    <p className="text-2xl font-bold text-white">
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(
                        summary.totalTVL
                      )}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 text-xl">💰</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-900/20 to-purple-600/10 border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-400">24h Volume</p>
                    <p className="text-2xl font-bold text-white">
                      {new Intl.NumberFormat('en-US', { 
                        style: 'currency', 
                        currency: 'USD',
                        notation: 'compact',
                        maximumFractionDigits: 1
                      }).format(
                        summary.totalVolume
                      )}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 text-xl">📊</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-900/20 to-orange-600/10 border border-orange-500/20 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-400">Avg APR</p>
                    <p className="text-2xl font-bold text-white">
                      {(
                        summary.averageAPR
                      ).toFixed(2)}%
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-orange-400 text-xl">📈</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pools Table */}
          <PoolsTable 
            pools={filteredPools}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={paginate}
            loading={loading}
            error={error}
          />
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            paginate={paginate}
          />
        </main>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default Dashboard;
