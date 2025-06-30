'use client'

import React, { useEffect, useState, useRef } from 'react';
import PoolsTable from '@/components/dashboard/overview/PoolsTable';
import Pagination from '@/components/dashboard/global/Pagination';
// import SearchBar from '@/components/SearchBar';
import apiClient from '@/libs/api';
import { Progress } from "@/components/ui/progress";
import Loader from '@/components/ui/loader';
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

  // New function to fetch pools with pagination
  const fetchPoolsData = async (page: number = 1) => {
    try {
      setLoading(true);
      
      console.log(`Fetching page ${page} with ${itemsPerPage} items per page`);
      
      const data: any = await apiClient.get(`/fetch-pools/${itemsPerPage}?page=${page}`);
      console.log('Fetched paginated data from API:', data);
      
      const { pools, totalPools, currentPage, totalPages, hasMore } = data;
      
      setPools(pools);
      setFilteredPools(pools);
      setTotalItems(totalPools);
      setCurrentPage(currentPage);
      
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <Loader size={48} />
          <h1 className="text-2xl font-bold mt-4">Loading...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <DashboardLayout>
    <div className="flex h-screen bg-black text-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/liquidity">Liquidity Pools</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* <div className="md:hidden">
            <SearchBar handleSearch={handleSearch} />
          </div> */}
        {/* </header> */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* <ChartContainer>
            <BarChart data={data}>
              <Bar dataKey="value" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer> */}
          <PoolsTable 
            pools={filteredPools}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            currentPage={currentPage}
            onPageChange={paginate}
          />
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
