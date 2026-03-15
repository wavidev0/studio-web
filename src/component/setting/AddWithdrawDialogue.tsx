import Button from "@/extra/Button";
import { ExInput } from "@/extra/Input";
import { closeDialog } from "@/store/dialogSlice";
import {
  createWithdrawMethod,
  updateWithdrawMethod,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: 24,
  p: "19px",
};
interface ErrorState {
  name: string;
  image: string;
  detail: string;
}

const AddWithdrawDialogue = () => {
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );


  const [addCategory, setAddCategory] = useState(false);
  const [name, setName] = useState();
  const [imagePath, setImagePath] = useState<string>();
  const [image, setImage] = useState();
  const [detail, setDetail] = useState("");
  const [error, setError] = useState({
    name: "",
    image: "",
    detail: "",
  });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (dialogue) {
      setAddCategory(dialogue);
    }
  }, [dialogue]);
  useEffect(() => {
    if (dialogueData) {
      setName(dialogueData?.name);
      setImagePath(dialogueData?.image);
      setImage(dialogueData?.image);
      setDetail(dialogueData?.details);
    }
  }, [dialogue, dialogueData]);

  const handleCloseAddCategory = () => {
    setAddCategory(false);
    dispatch(closeDialog());
  };

  const handleInputImage = (e: any) => {
    if (e.target.files) {
      setImage(e?.target?.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError({ ...error, image: "" });
    }
  };
  const handleSubmit = () => {


    if (!name || (dialogueData ? "" : !image) || !detail) {
      let error = {} as ErrorState;
      if (!name) error.name = "Name Is Required !";
      if (!image) error.image = "Image Is Required !";
      if (!detail) error.detail = "Detail Is Required !";
      return setError({ ...error });
    } else {
      const formData: any = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      formData.append("details", detail);

      if (dialogueData) {
        let payload: any = {
          id: dialogueData?._id,
          formData: formData,
        };
        dispatch(updateWithdrawMethod(payload));
      } else {
        dispatch(createWithdrawMethod(formData));
      }
      handleCloseAddCategory();
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
        <div className='model-header'>
          <p className='m-0'>{dialogueData
            ? "Update payment method dialog"
            : "Create payment method dialog"}</p>
        </div>
        <div className="model-body">
          <form>
            <div className="row align-items-start formBody">
              <div className="col-md-12">
                <ExInput
                  label={"Name"}
                  name={"name"}
                  placeholder={"Enter Name..."}
                  value={name}
                  errorMessage={error.name && error.name}
                  onChange={(e: any) => {
                    setName(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        name: `Name Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        name: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-md-12">
                <ExInput
                  label={"Detail"}
                  name={"detail"}
                  placeholder={"Enter Details..."}
                  value={detail}
                  errorMessage={error.detail && error.detail}
                  onChange={(e) => {
                    setDetail(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        detail: `Details Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        detail: "",
                      });
                    }
                  }}
                />

                <span className='extention-show'>
                  Note : Enter details coma (,) separated string.
                </span>
              </div>

              <div className="col-md-12 mt-3">
                <ExInput
                  type={"file"}
                  label={"Image"}
                  accept={"image/png, image/jpeg"}
                  errorMessage={error.image && error.image}
                  onChange={handleInputImage}
                />
              </div>
              <div className=" mt-2 fake-create-img mb-2">
                {imagePath && (
                  <>
                    <img
                      src={imagePath ? imagePath : dialogueData?.image}
                      className="mt-3 rounded float-left mb-2"
                      alt="image"
                    // style={{ width: "100px", height: "100px" }}
                    />
                  </>
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
                type={`submit`}
                text={`Submit`}
                onClick={(e: any) => handleSubmit()}
              />
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddWithdrawDialogue;
