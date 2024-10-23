'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useWallet } from '@/providers/Wallet'; // Adjust path based on your project structure
import PoolsTable from '@/components/PoolsTable';
import Pagination from '@/components/Pagination';
// import SearchBar from '@/components/SearchBar';
import apiClient from '@/libs/api';
import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Bar, BarChart } from "recharts";
// import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
// import { Package2, LayoutDashboard, Wallet, History, LogOut, Settings, File, Database, User, Sidebar } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import DashboardLayout from './Layout/DashboardLayout';
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

  const { account, handleLogin, handleLogout }:any = useWallet() || {}; // Getting account status and login handler from Wallet provider
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

  // const handleSearch = (query: string) => {
  //   setSearchQuery(query);
  // };

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Loading...</h1>
          <br/>
          <Progress value={50} />
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
        <header className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-gray-800">
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
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {/* <ChartContainer>
            <BarChart data={data}>
              <Bar dataKey="value" />
              <ChartTooltip content={<ChartTooltipContent />} />
            </BarChart>
          </ChartContainer> */}
          <PoolsTable 
            pools={filteredPools.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
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
