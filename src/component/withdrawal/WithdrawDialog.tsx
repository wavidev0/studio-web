import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootStore, useAppDispatch } from "@/store/store";
import { closeDialog } from "@/store/dialogSlice";
import { ExInput } from "@/extra/Input";
import { Box, Modal } from '@mui/material';
import Button from '@/extra/Button';

const WithdrawDialog = () => {
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);

  const dispatch = useAppDispatch();
  const [mongoId, setMongoId] = useState<any>();


  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData);
    }
  }, [dialogueData]);

  return (
    <Modal open={true}
      onClose={() => dispatch(closeDialog())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="model-style">
        <div className="model-header">
          <p className='m-0'>Bank Details</p>
        </div>
        <div className="model-body">
          <form id="expertForm">
            <div className="row align-items-start formBody">
              {mongoId?.paymentDetails &&
                mongoId?.paymentDetails.map((data: any) => {
                  let items = data?.split(":");
                  return (
                    <div className="col-12">
                      <ExInput
                        type={`text`}
                        id={`${items[0]}`}
                        name={`${items[0]}`}
                        label={`${items[0]}`}
                        placeholder={`${items[0]}`}
                        value={items[1]}
                        disabled={true}
                      />
                    </div>
                  );
                })}
            </div>
          </form>
        </div>
        <div className="model-footer">
          <div className="m-3 d-flex justify-content-end gap-2">
            <Button
              className={`close-model-btn`}
              text={`Close`}
              type={`button`}
              onClick={() => dispatch(closeDialog())}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default WithdrawDialog;
