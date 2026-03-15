import Button from '@/extra/Button';

import Table from '@/extra/Table';

import {
  activeWithdrawMethod,
  deleteWithdrawMethod,
  getSetting,
  getWithdrawMethod,
  updateSetting,
} from '@/store/settingSlice';
import { RootStore, useAppDispatch } from '@/store/store';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { openDialog } from '@/store/dialogSlice';
import { warning } from '@/utils/Alert';
import ToggleSwitch from '@/extra/TogggleSwitch';
import AddWithdrawDialogue from './AddWithdrawDialogue';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import LazyImage from '@/extra/ImageFallback';

interface ErrorState {
  minWithdrawalRequestedCoin: string;
  minWithdrawalRequestedAmount: any;
}

const WithdrawSetting = () => {
  const { setting, withdrawSetting } = useSelector(
    (state: RootStore) => state.setting
  );

  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [showImg, setShowImg] = useState();
  const [actionPagination, setActionPagination] = useState('delete');
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [minWithdrawalRequestedCoin, setMinWithdrawalRequestedCoin] =
    useState();
  const [minWithdrawalRequestedAmount, setMinWithdrawalRequestedAmount] =
    useState('');

  const [error, setError] = useState<any>({
    minWithdrawalRequestedCoin: '',
    minWithdrawalRequestedAmount: '',
  });

  useEffect(() => {
    let payload: any = {};
    dispatch(getWithdrawMethod());
    
      dispatch(getSetting(payload));
    
  }, [dispatch]);

  useEffect(() => {
    if (setting) {
      setMinWithdrawalRequestedAmount((setting as any)?.minWithdraw);
    }
  }, [setting]);

  useEffect(() => {
    setData(withdrawSetting);
  }, [withdrawSetting]);

  const handleEdit = (row: any, type: any) => {


    dispatch(openDialog({ type: type, data: row }));
  };

  const withdrawTable = [
    {
      Header: 'No',
      body: 'name',
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: 'Image',
      body: 'image',
      Cell: ({ row }) => (
        <LazyImage src={row?.image || `/images/user.jpg`} alt={""} style={{ height: "50px", width: "50px", overflow: "hidden" }} />
      ),
    },
    {
      Header: 'Name',
      body: 'name',
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },
    {
      Header: "Details",
      Cell: ({ row }) => {
        const details = row?.details?.join(", ");
        const words = details?.split(" ");
        const trimmedDetails =
          words?.length > 10 ? words?.slice(0, 10)?.join(" ") + "..." : details;

        return (
          <span className="text-capitalize ">{trimmedDetails}</span>
        );
      },
    },
    {
      Header: 'Created At',
      body: 'createdAt',
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format('DD MMMM YYYY') : ''}
        </span>
      ),
    },
    {
      Header: 'Active',
      body: 'isActive',
      Cell: ({ row }) => (
        <ToggleSwitch
          onClick={() => handleIsActive(row?._id)}
          value={row?.isEnabled}
        />
      ),
    },
    {
      Header: 'Actions',
      body: 'action',
      Cell: ({ row }) => (
        <div className="act-group">
          <button className="act-icon act-amber" onClick={() => dispatch(openDialog({ type: 'withdraw', data: row }))}>
            <IconEdit size={15} />
          </button>
          <button className="act-icon act-red" onClick={() => handleDeleteWithdraw(row?._id)}>
            <IconTrash size={15} />
          </button>
        </div>
      ),
    },
  ];

  const handleOpenNew = (type: any) => {

    dispatch(openDialog({ type: type }));
  };

  const handleSelectAll = (event: any) => {
    const checked = event.target.checked;
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };
  const handleDeleteWithdraw = (id: any) => {

    const data = warning('Delete');
    data
      .then((logouts) => {
        const yes = logouts.isConfirmed;

        if (yes) {
          dispatch(deleteWithdrawMethod(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleIsActive = (id: any) => {


    dispatch(activeWithdrawMethod(id));
  };

  const onsubmit = async (e) => {

    e.preventDefault();
    if (
      !minWithdrawalRequestedAmount
    ) {
      let error = {};
      if (!minWithdrawalRequestedAmount)
        return setError({ ...error, minWithdrawalRequestedAmount: "Withdraw Amount is required" })

    } else {
      const data = {
        minWithdraw: minWithdrawalRequestedAmount,
      };
      const payload = { data: data, id: (setting as any)?._id };
      await dispatch(updateSetting(payload)).unwrap();
    }
  };

  return (
    <div>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>Withdraw Setting</h6>
          <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF' }}>Manage withdrawal methods and minimum limits</p>
        </div>
        <button onClick={onsubmit} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Save Changes
        </button>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Minimum Withdrawal Request Amount</label>
        <input
          type="text"
          className="form-control"
          style={{ borderRadius: 8, fontSize: 13, maxWidth: 320 }}
          id="minWithdrawalRequestedAmount"
          value={minWithdrawalRequestedAmount}
          placeholder="Enter minimum withdrawal amount"
          onChange={(e) => {
            setMinWithdrawalRequestedAmount(e.target.value);
            if (!e.target.value) {
              return setError({ ...error, minWithdrawalRequestedAmount: 'Withdrawal Requested Amount Is Required' });
            } else {
              return setError({ ...error, minWithdrawalRequestedAmount: '' });
            }
          }}
        />
        {error.minWithdrawalRequestedAmount && <p style={{ margin: '4px 0 0', fontSize: 11, color: '#EF4444' }}>{error.minWithdrawalRequestedAmount}</p>}
        <p style={{ margin: '6px 0 0', fontSize: 11, color: '#9CA3AF' }}>Studio cannot post a withdraw request less than this amount</p>
      </div>

      <div style={{ borderTop: '1px solid #F3F4F6', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h6 style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#111827' }}>Withdraw Payment Methods</h6>
          <button onClick={() => dispatch(openDialog({ type: 'withdraw' }))}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: 'none', background: '#6366F1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            <IconPlus size={14} /> Add Method
          </button>
        </div>

        <Table data={withdrawSetting} mapData={withdrawTable} type={'client'} />
      </div>
      {dialogueType === 'withdraw' && <AddWithdrawDialogue />}
    </div>
  );
};

export default WithdrawSetting;
