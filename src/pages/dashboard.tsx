import RootLayout from '@/component/layout/Layout';
import Analytics from '@/extra/Analytic';
import Table from '@/extra/Table';
import {
  getChartData,
  getDashboardData,
  getTopDoctorData,
  getUpcomingBookings,
} from '@/store/dashboardSlice';
import { RootStore, useAppDispatch } from '@/store/store';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isLoading } from '@/utils/allSelector';
import { getSetting } from '@/store/settingSlice';
import {
  IconCalendar, IconHospital, IconTax, IconUser, IconWallet,
  IconArrowUpRight, IconArrowDownRight,
} from '@tabler/icons-react';
import LazyImage from '@/extra/ImageFallback';

interface topDoctorData {
  doctorId?: string;
  doctorImage?: string;
  name?: string;
  doctorEarning?: number;
  appointment?: number;
}

// ─── Metric Card ─────────────────────────────────────────────────────────────

const MetricCard = ({ link, title, count, Icon, gradient, trend = '+0%', trendUp = true }: any) => {
  const router = useRouter();
  return (
    <div
      className="dash-metric-card"
      onClick={() => router.push(link)}
      style={{ cursor: 'pointer' }}
    >
      <div className="dash-metric-inner">
        <div className="dash-metric-left">
          <p className="dash-metric-label">{title}</p>
          <h2 className="dash-metric-value">{count ?? 0}</h2>
          <span className={`dash-metric-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
            {trendUp ? <IconArrowUpRight size={13} /> : <IconArrowDownRight size={13} />}
            {trend}
          </span>
        </div>
        <div className="dash-metric-icon-wrap" style={{ background: gradient }}>
          <Icon size={22} color="#fff" />
        </div>
      </div>
      <div className="dash-metric-bar">
        <div className="dash-metric-bar-fill" style={{ background: gradient }} />
      </div>
    </div>
  );
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const [startDate, setStartDate] = useState('ALL');
  const [endDate, setEndDate] = useState('ALL');
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const router = useRouter();
  const dashboard: any = useSelector((state: RootStore) => state.dashboard);
  const cur = setting?.currencySymbol || '$';

  useEffect(() => {
    const payload: any = { startDate, endDate };
    dispatch(getDashboardData(payload));
    dispatch(getTopDoctorData(payload));
    dispatch(getUpcomingBookings(payload));
    dispatch(getChartData(payload));
  }, [dispatch, startDate, endDate]);

  useEffect(() => { dispatch(getSetting()); }, []);

  const handleInfo = (id: any) => {
    router.push({ pathname: '/DoctorProfile', query: { id } });
  };

  const metrics = [
    {
      link: '/User', title: 'Total Users', Icon: IconUser,
      count: dashboard?.dashboardData?.users?.toFixed() ?? 0,
      gradient: 'linear-gradient(135deg,#6366F1,#818CF8)',
      trend: '+12%', trendUp: true,
    },
    {
      link: '/bookings/booking', title: 'Total Bookings', Icon: IconCalendar,
      count: dashboard?.dashboardData?.appointments?.toFixed() ?? 0,
      gradient: 'linear-gradient(135deg,#8B5CF6,#A78BFA)',
      trend: '+8%', trendUp: true,
    },
    {
      link: '/DoctorTable', title: 'Total Studios', Icon: IconHospital,
      count: dashboard?.dashboardData?.doctors?.toFixed() ?? 0,
      gradient: 'linear-gradient(135deg,#06B6D4,#22D3EE)',
      trend: '+3%', trendUp: true,
    },
    {
      link: '/Withdrawal', title: 'Studio Earnings', Icon: IconTax,
      count: `${cur}${dashboard?.dashboardData?.earning?.toFixed() ?? 0}`,
      gradient: 'linear-gradient(135deg,#F59E0B,#FCD34D)',
      trend: '+5%', trendUp: true,
    },
    {
      link: '/bookings/monthlyReport', title: 'Total Revenue', Icon: IconWallet,
      count: `${cur}${dashboard?.dashboardData?.revenue?.toFixed() ?? 0}`,
      gradient: 'linear-gradient(135deg,#10B981,#34D399)',
      trend: '+18%', trendUp: true,
    },
  ];

  const topDoctorData = [
    {
      Header: 'No',
      Cell: ({ index }: { index: number }) => <span>{index + 1}</span>,
    },
    {
      Header: 'Image',
      Cell: ({ row }: { row: topDoctorData }) => (
        <div className="userProfile" onClick={() => handleInfo(row?.doctorId)}>
          <LazyImage
            src={row?.doctorImage || `/images/user.jpg`}
            style={{ height: '40px', width: '40px', borderRadius: '8px', overflow: 'hidden' }}
            alt="studio"
            height="100%"
          />
        </div>
      ),
    },
    {
      Header: 'Name',
      Cell: ({ row }: { row: topDoctorData }) => (
        <span style={{ fontWeight: 600, cursor: 'pointer' }} onClick={() => handleInfo(row?.doctorId)}>
          {row?.name}
        </span>
      ),
    },
    {
      Header: `Earnings (${cur})`,
      Cell: ({ row }: { row: topDoctorData }) => (
        <span style={{ fontWeight: 600, color: '#6366F1' }}>{row?.doctorEarning} {cur}</span>
      ),
    },
    {
      Header: 'Bookings',
      Cell: ({ row }: { row: topDoctorData }) => (
        <span style={{ fontWeight: 600 }}>{row?.appointment}</span>
      ),
    },
  ];

  const upcomingBookingsData = [
    {
      Header: 'No',
      Cell: ({ index }: { index: number }) => <span>{index + 1}</span>,
    },
    {
      Header: 'User',
      Cell: ({ row }: { row: any }) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LazyImage
            src={row?.user?.image || `/images/user.jpg`}
            alt=""
            style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }}
            onClick={() => router.push({ pathname: '/UserProfile', query: { id: row?.user?._id } })}
          />
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{row?.user?.name}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{row?.date?.split('T')[0]}</div>
          </div>
        </div>
      ),
    },
    {
      Header: 'Studio',
      Cell: ({ row }: { row: any }) => (
        <span style={{ cursor: 'pointer' }} onClick={() => handleInfo(row?.doctor?._id)}>
          {row?.doctor?.name}
        </span>
      ),
    },
    {
      Header: 'Time',
      Cell: ({ row }: { row: any }) => <span>{row?.time}</span>,
    },
  ];

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-header">
        <div>
          <p className="dash-greeting">Good day 👋</p>
          <h1 className="dash-title">Dashboard</h1>
        </div>
        <Analytics
          analyticsStartDate={startDate}
          analyticsStartEnd={endDate}
          analyticsStartDateSet={setStartDate}
          analyticsStartEndSet={setEndDate}
          direction="end"
        />
      </div>

      {/* Metric Cards */}
      <div className="dash-metrics-grid">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Chart */}
      <div className="dash-chart-card">
        <div className="dash-chart-header">
          <div>
            <h3 className="dash-chart-title">Revenue Analytics</h3>
            <p className="dash-chart-sub">Revenue, bookings & services over time</p>
          </div>
          <div className="dash-chart-badge">Live</div>
        </div>
        <ApexChart />
      </div>

      {/* Bottom Tables */}
      <div className="dash-tables-grid">
        <div className="dash-table-card">
          <div className="dash-table-header">
            <h3 className="dash-table-title">🏆 Top Studios</h3>
          </div>
          <Table data={dashboard?.topDoctors} mapData={topDoctorData} type="client" className="border-0" />
        </div>
        <div className="dash-table-card">
          <div className="dash-table-header">
            <h3 className="dash-table-title">📅 Upcoming Bookings</h3>
          </div>
          <Table data={dashboard?.upcomingBookings} mapData={upcomingBookingsData} type="client" className="border-0" />
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Dashboard;

// ─── ApexChart ────────────────────────────────────────────────────────────────

const ApexChart = () => {
  const dispatch = useAppDispatch();
  const ChartChart = dynamic(() => import('react-apexcharts'), { ssr: false });
  const { chartData } = useSelector((state: RootStore) => state.dashboard);
  const { setting }: any = useSelector((state: RootStore) => state?.setting);
  const currencySymbol = setting?.currencySymbol ?? '';

  useEffect(() => {
    dispatch(getChartData({ startDate: 'ALL', endDate: 'ALL' }));
  }, [dispatch]);

  type RawRow = {
    amount?: number | string;
    count?: number | string;
    services?: number | string;
    revenue?: number | string;
    date?: string | Date;
    _id?: string | Date;
  };

  const toNum = (v: unknown) => (v == null || v === '' ? 0 : Number(v));

  const normalizeChartRows = (rows: RawRow[] = []) =>
    rows
      .map((r) => {
        const rawDate = (r as any)._id ?? r.date;
        const d = dayjs(rawDate);
        return {
          x: d.isValid() ? d.toDate() : new Date(String(rawDate)),
          revenue: toNum(r.revenue),
          amount: toNum(r.amount),
          count: toNum(r.count),
          services: toNum(r.services),
        };
      })
      .sort((a, b) => a.x.getTime() - b.x.getTime());

  const formatNumber = (n: number) => {
    if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
    if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
    if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return Number.isInteger(n) ? String(n) : n?.toFixed(2).replace(/\.00$/, '');
  };

  const rows = normalizeChartRows(chartData as RawRow[]);

  const series = [
    { name: 'Revenue', data: rows.map((p) => ({ x: p.x, y: p.revenue })) },
    { name: 'Amount', data: rows.map((p) => ({ x: p.x, y: p.amount })) },
    { name: 'Bookings', data: rows.map((p) => ({ x: p.x, y: p.count })) },
    { name: 'Services', data: rows.map((p) => ({ x: p.x, y: p.services })) },
  ];

  const options: any = {
    chart: {
      type: 'area',
      stacked: false,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: { enabled: true, speed: 600 },
      fontFamily: 'Inter, sans-serif',
    },
    colors: ['#6366F1', '#8B5CF6', '#06B6D4', '#10B981'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 95, 100],
      },
    },
    stroke: { curve: 'smooth', width: 2.5 },
    markers: { size: 0, hover: { size: 5 } },
    dataLabels: { enabled: false },
    grid: {
      borderColor: '#F3F4F6',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { left: 8, right: 8 },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        datetimeUTC: false,
        style: { colors: '#9CA3AF', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: [
      {
        decimalsInFloat: 0,
        labels: {
          formatter: (val: number) =>
            currencySymbol ? `${currencySymbol}${formatNumber(val)}` : formatNumber(val),
          style: { colors: '#9CA3AF', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
          offsetX: -4,
        },
      },
      { show: false },
      {
        opposite: true,
        labels: {
          formatter: (val: number) => formatNumber(val),
          style: { colors: '#9CA3AF', fontSize: '11px', fontFamily: 'Inter, sans-serif' },
        },
      },
      { show: false },
    ],
    tooltip: {
      shared: true,
      theme: 'light',
      x: { format: 'dd MMM yyyy' },
      y: {
        formatter: (val: number, { w, seriesIndex }: any) => {
          const sName = w.globals.seriesNames[seriesIndex];
          const isMoney = sName === 'Revenue' || sName === 'Amount';
          return isMoney
            ? currencySymbol
              ? `${currencySymbol}${formatNumber(val)}`
              : formatNumber(val)
            : formatNumber(val);
        },
      },
      style: { fontSize: '12px', fontFamily: 'Inter, sans-serif' },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      fontWeight: 600,
      markers: { width: 8, height: 8, radius: 4 },
      itemMargin: { horizontal: 12 },
    },
    responsive: [
      { breakpoint: 768, options: { chart: { height: 280 }, legend: { position: 'bottom' } } },
    ],
  };

  return (
    <ChartChart options={options} series={series} type="area" height={340} />
  );
};
