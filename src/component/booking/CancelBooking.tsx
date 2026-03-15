import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { closeDialog } from "@/store/dialogSlice";
import { ExInput } from "@/extra/Input";
import Button from "@/extra/Button";
import { Box, Modal } from '@mui/material';

const CancelBooking = () => {
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);
  const dispatch = useAppDispatch();
  const [mongoId, setMongoId] = useState<any>();


  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData);
    }
  }, [dialogueData]);

  return (
    <Modal
      open={true}
      onClose={() => dispatch(closeDialog())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="model-style">
        <div className="model-header">
          <h5 className="m-0">Cancel Details</h5>
        </div>
        <div className="model-body">
          <form id="expertForm">
            <div className="row align-items-start formBody">
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`reason`}
                  name={`reason`}
                  label={`Reason`}
                  placeholder={`Reason`}
                  value={mongoId?.cancel?.reason}
                  disabled={true}
                />
              </div>
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`Date`}
                  name={`Date`}
                  label={`Date`}
                  placeholder={`Date`}
                  value={mongoId?.cancel?.date}
                  disabled={true}
                />
              </div>
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`Time`}
                  name={`Time`}
                  label={`Time`}
                  placeholder={`Time`}
                  value={mongoId?.cancel?.time}
                  disabled={true}
                />
              </div>
            </div>

          </form>
        </div>
        <div className="model-footer">
          <div className="m-3 d-flex justify-content-end gap-2">
            <Button
              className={`close-model-btn`}
              text={`Cancel`}
              type={`button`}
              onClick={() => dispatch(closeDialog())}
            />
          </div>
        </div>

      </Box>
    </Modal >
  );
};
export default CancelBooking;
