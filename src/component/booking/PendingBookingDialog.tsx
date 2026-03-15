import React, { useEffect, useState } from "react";
import { RootStore, useAppDispatch } from "@/store/store";
import { closeDialog } from "@/store/dialogSlice";

import { ExInput } from "@/extra/Input";
import Button from "@/extra/Button";
import { useSelector } from "react-redux";
import { cancelBooking } from "@/store/bookingSlice";
import { Box, Modal } from '@mui/material';

const PendingBookingDialog = () => {
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);


  const dispatch = useAppDispatch();
  const [reason, setReason] = useState("");
  const [mongoId, setMongoId] = useState<any>();
  const [error, setError] = useState("");

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData);
    }
  }, [dialogueData]);

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!reason) {
      setError("Reason is Required");
    } else {
      if (dialogueData) {
        const payload: any = {
          reason: reason,
          appoinmentId: mongoId,
        };
        dispatch(cancelBooking(payload));
        dispatch(closeDialog());
      }
    }
  };

  return (
    <Modal
      open={true}
      onClose={() => dispatch(closeDialog())}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="model-style">
        <div className="model-header">
          <p className="m-0">Cancel Booking</p>
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
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (!e.target.value) {
                      return setError("Reason is Required !");
                    } else {
                      setError("");
                    }
                  }}
                />
                {error && (
                  <p className="errorMessage text-start">
                    {error && error}
                  </p>
                )}
              </div>
            </div>
          </form>
          <div className="model-footer">
            <div className="m-3 d-flex justify-content-end gap-2">
              <Button
                className={`close-model-btn`}
                text={`Cancel`}
                type={`button`}
                onClick={() => dispatch(closeDialog())}
              />
              <Button
                onClick={handleSubmit}
                type={`submit`}
                text={`Submit`}
              />
            </div>
          </div>
        </div>
      </Box >
    </Modal >
  );
};
export default PendingBookingDialog;
