import Button from "@/extra/Button";
import { ExInput } from "@/extra/Input";
import { closeDialog } from "@/store/dialogSlice";
import { createService, updateService } from "@/store/serviceSlice";
import { RootStore, useAppDispatch } from "@/store/store";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Modal } from "@mui/material";

interface ErrorState {
  name: string;
  image: string;
  // subService: string;
}

const ServicesDialogue = () => {
  const dispatch = useAppDispatch();

  const { dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );


  const [name, setName] = useState<string>();
  const [image, setImage] = useState<any>();
  const [imagePath, setImagePath] = useState<any>();

  const [error, setError] = useState({
    name: "",
    image: "",
    // subService: "",
  });

  useEffect(() => {
    setName(dialogueData?.name);
    setImagePath(dialogueData?.image);
    setImage(dialogueData?.image);
  }, [dialogueData]);

  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setImage(e?.target?.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      return setError({ ...error, image: "" });
    }
  };

  const handleSubmit = (e: any) => {


    if (!name || !image) {
      let error = {} as ErrorState;
      if (!name) error.name = "Name is required";
      if (!image) error.image = "Image is required";
      return setError({ ...error });
    } else {


      const formData: any = new FormData();
      formData.append("name", name);
      formData.append("image", image);

      if (dialogueData) {
        let payload: any = {
          id: dialogueData?._id,
          formData: formData,
        };

        dispatch(updateService(payload));
      } else {
        dispatch(createService(formData));
      }

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
          <p className="m-0">{dialogueData ? "Update Category" : "Add Category"}</p>
        </div>

        <div className="model-body">
          <form id="expertForm">
            <div className="row align-items-start formBody">
              <div className="col-12">
                <ExInput
                  type={`text`}
                  id={`name`}
                  name={`name`}
                  value={name}
                  label={`Name`}
                  className={`form-control`}
                  defaultValue={dialogueData && dialogueData?.name}
                  placeholder={`Name`}
                  errorMessage={error.name && error.name}
                  onChange={(e: any) => {
                    setName(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        name: ` Name is required`,
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
              <div className="col-12">
                <ExInput
                  type={"file"}
                  label={"Image"}
                  className={`form-control`}
                  accept={"image/png, image/jpeg"}
                  errorMessage={error.image && error.image}
                  onChange={handleInputImage}
                />

                {imagePath && (
                  <>
                    <img
                      src={imagePath ? imagePath : dialogueData?.image}
                      className="mt-3 rounded float-left mb-2"
                      alt="image"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </>
                )}
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

export default ServicesDialogue;
