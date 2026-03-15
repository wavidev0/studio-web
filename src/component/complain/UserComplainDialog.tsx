import React, { useEffect, useState } from "react";
import { RootStore, useAppDispatch } from "@/store/store";
import { closeDialog } from "@/store/dialogSlice";

import { ExInput, Textarea } from "@/extra/Input";
import Button from "@/extra/Button";
import { useSelector } from "react-redux";
import {
  pendingToSolveDoctorComplain,
  pendingToSolveUserComplain,
} from "@/store/complainSlice";
import { Box, Modal } from '@mui/material';

const UserComplainDialog = () => {
  const { dialogueData } = useSelector((state: RootStore) => state.dialogue);



  const dispatch = useAppDispatch();
  const [imagePath, setImagePath] = useState("");
  const [description, setDescription] = useState("");
  const [mongoId, setMongoId] = useState<any>();

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData);
      setDescription(dialogueData?.details);
      setImagePath(dialogueData?.image);
    }
  }, [dialogueData]);

  const handleSubmit = async (e: any) => {

    e.preventDefault();

    if (dialogueData && dialogueData.person == 1) {
      dispatch(pendingToSolveDoctorComplain(mongoId?._id));
      dispatch(closeDialog());
    } else if (dialogueData && dialogueData.person == 2) {
      dispatch(pendingToSolveUserComplain(mongoId?._id));
      dispatch(closeDialog());
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
          <p className='m-0'>Resolve Complain</p>
        </div>
        <div className="model-body">
          <form id="expertForm">
            <div className="row align-items-start formBody">
              <div className="col-12">
                <Textarea
                  type={`text`}
                  name={`description`}
                  label={`Description`}
                  placeholder={`description`}
                  value={description}
                  disabled
                />
              </div>

              {imagePath && (
                <>
                  <label>Image</label>
                  <div className="col-12">
                    <img
                      src={imagePath ? imagePath : dialogueData?.image}
                      className="mt-3 rounded float-left mb-2"
                      alt="image"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
        <div className="model-footer">
          <div className="m-3 d-flex justify-content-end gap-2">
            <Button
              type={`submit`}
              text={`Submit`}
              onClick={(e: any) => handleSubmit(e)}
            />
          </div>
        </div>
      </Box>
    </Modal>
  );
};
export default UserComplainDialog;
