import React, { useEffect, useState } from 'react';
import RootLayout from '@/component/layout/Layout';
import { RootStore, useAppDispatch } from '@/store/store';
import AdminSetting from '@/component/setting/AdminSetting';
import PaymentSetting from '@/component/setting/PaymentSetting';
import WithdrawSetting from '@/component/setting/WithdrawSetting';
import { useSelector } from 'react-redux';
import { getSetting } from '@/store/settingSlice';
import { IconSettings, IconCreditCard, IconWallet, IconChevronRight } from '@tabler/icons-react';

const tabs = [
  { key: 'general',  label: 'General Setting',  icon: <IconSettings size={16} />,    desc: 'App, currency, API keys' },
  { key: 'payment',  label: 'Payment Setting',   icon: <IconCreditCard size={16} />,  desc: 'Stripe, Razorpay, PayPal' },
  { key: 'withdraw', label: 'Withdraw Setting',  icon: <IconWallet size={16} />,      desc: 'Withdrawal methods & limits' },
];

const Setting = () => {
  const [type, setType] = useState('general');
  const dispatch = useAppDispatch();

  useEffect(() => { dispatch(getSetting()); }, [dispatch]);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Sidebar */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F3F4F6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 8px', borderBottom: '1px solid #F3F4F6' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 }}>Settings</p>
          </div>
          <div style={{ padding: '8px 8px' }}>
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setType(t.key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: type === t.key ? '#EEF2FF' : 'transparent',
                  marginBottom: 4, transition: 'all 0.15s', textAlign: 'left',
                }}>
                <span style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                  background: type === t.key ? '#6366F1' : '#F3F4F6',
                  color: type === t.key ? '#fff' : '#6B7280',
                }}>
                  {t.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: type === t.key ? '#4338CA' : '#111827' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{t.desc}</div>
                </div>
                {type === t.key && <IconChevronRight size={14} color="#6366F1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #F3F4F6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
          {type === 'general'  && <AdminSetting />}
          {type === 'payment'  && <PaymentSetting />}
          {type === 'withdraw' && <WithdrawSetting />}
        </div>
      </div>
    </div>
  );
};

Setting.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default Setting;
