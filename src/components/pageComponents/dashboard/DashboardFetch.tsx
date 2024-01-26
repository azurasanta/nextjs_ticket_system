'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux'
import { setId } from '../../../redux/slices/idSlice'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import DashboardFilter from './DashboardFilter';
import Link from 'next/link';
import Combobox from './Combobox';
import { Badge } from '@/components/ui/badge';
import { getTailwindClasses } from '@/components/utils/utils';


interface Report {
  _id: string;
  projectId: string;
  name: string;
  email: string;
  description: string;
  relevance: string;
  status: string;
  date: string;
  __v: number;
}

const DashboardFetch: React.FC = () => {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [expandedDescription, setExpandedDescription] = useState<string | null>(null);
  const [email, setEmail] = useState("")
  const [newEmail, setNewEmail] = useState('')
  const [filterOptions, setFilterOptions] = useState({
    status: 'All',
    relevance: 'All',
  });

  const id = useSelector((state: any) => state.id.id);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data: Report[] = await response.json();
        let filteredReports = data.filter((report) => report.email === session?.user?.email);
    
        // Apply status filter
        if (filterOptions.status !== 'All') {
          filteredReports = filteredReports.filter((report) => report.status === filterOptions.status);
        }
    
        // Apply relevance filter
        if (filterOptions.relevance !== 'All') {
          filteredReports = filteredReports.filter((report) => report.relevance === filterOptions.relevance);
        }
    
        setReports(filteredReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchData();
  }, [session, filterOptions]);

  const idModifier = (reportId: string) => {
    // Dispatch the action to update the id in Redux store
    dispatch(setId(reportId));
  };

  const capitalizeFirstLetter = (text:any) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const updateStatusLocally = useCallback((selectedStatus:any, reportId:any) => {
    // Update the status locally without making an API call
    setReports((prevReports) =>
      prevReports.map((report) =>
        report._id === reportId ? { ...report, status: selectedStatus } : report
      )
    );
  }, [setReports]);

    useEffect(() => {
    console.log(id)
  }, [id])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilterOptions((prevOptions) => ({
      ...prevOptions,
      [filterType]: value,
    }));
  };
  
  return (
    <div className='gap-0 mt-10'>
      <div className='flex items-center justify-between px-10'>
        <div className='text-[42px]'>Welcome back, <strong>{session?.user?.name}</strong></div>
        <DashboardFilter onFilterChange={handleFilterChange} />
      </div>
      <ul className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-w-full gap-0'>
        {reports.map(report => (
          <Card className="mx-10 my-10 overflow-hidden" key={report?._id}>
            <CardHeader>
              <CardTitle className='whitespace-nowrap text-ellipsis overflow-hidden'>{report.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full items-center gap-4">
              <div>
                <Label htmlFor="name">Relevance</Label>
                <CardDescription>
                  <Badge className={`mt-2 ${getTailwindClasses(report?.relevance)} hover:cursor-pointer text-white`}>
                    {report?.relevance ? capitalizeFirstLetter(report.relevance) : ''}
                  </Badge>
                </CardDescription>
              </div>
                <div>
                  <Label htmlFor="name">Status</Label>
                  <CardDescription>
                  <Badge className={`mt-2 ${getTailwindClasses(report?.status)} hover:cursor-pointer text-white`}>
                    {report?.status ? capitalizeFirstLetter(report.status) : ''}
                  </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between w-full items-center">
                <Link href={`/dashboard/${report?._id}`} className='w-full mr-5'>
                  <Button className='w-full' onClick={() => idModifier(report?._id)}>See More</Button>
                </Link>
                <Combobox reportId={report?._id} onUpdateStatusLocally={updateStatusLocally} />
            </CardFooter>
          </Card>
          
        ))}
      </ul>
    </div>
  );


};

export default DashboardFetch;
