import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { ExInput } from "@/extra/Input";
import Button from "@/extra/Button";
import { closeDialog } from "@/store/dialogSlice";
import { Box, Modal } from '@mui/material';

const CompletedBooking = () => {
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
          <p className="m-0">Appointment Info</p>
        </div>
        <div className="model-body">
          <form id="expertForm">
            <div className="row align-items-start formBody">
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`checkInTime`}
                  name={`checkInTime`}
                  label={`Check In Time`}
                  placeholder={`checkIn time`}
                  value={mongoId?.checkInTime}
                  disabled={true}
                />
              </div>
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`checkOutTime`}
                  name={`checkOut time`}
                  label={`Check Out Time`}
                  placeholder={`checkoutTime`}
                  value={mongoId?.checkOutTime}
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
    </Modal>
  );
};
export default CompletedBooking;
