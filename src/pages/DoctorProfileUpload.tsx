import React, { useState, useEffect } from "react";
import { GradientWarning } from "@/api/toastServices";
import { Button, IconButton, Box, Card, CardMedia } from "@mui/material";
import { getDoctorProfile, updateDoctor, updateStudioMultiImage } from "@/store/doctorSlice";
import { closeDialog } from "@/store/dialogSlice";
import { useAppDispatch } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const MAX_FILES = 5;

const UploadFiles: React.FC = () => {
  const dispatch = useAppDispatch();
  const { dialogueData } = useSelector((state: any) => state.dialogue);
  const { doctorProfile } = useSelector((state: RootStore) => state.doctor);
  const router = useRouter();
  const id: any = router?.query?.id;
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingFiles, setExistingFiles] = useState<string[]>(
    doctorProfile?.additionalProfileImages || []
  );

  useEffect(() => {
    setExistingFiles(doctorProfile?.additionalProfileImages || []);
  }, [doctorProfile]);

  // Handle File Selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedFiles = Array.from(event.target.files);
    if (
      selectedFiles.length + existingFiles.length + files.length >
      MAX_FILES
    ) {
      GradientWarning(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }

    const validFiles = selectedFiles.filter((file) =>
      [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "video/mp4",
        "video/avi",
        "video/mov",
      ].includes(file.type)
    );

    if (validFiles.length !== selectedFiles.length) {
      GradientWarning(
        "Only JPG, JPEG, PNG, MP4, AVI, and MOV files are allowed."
      );
    }

    setFiles((prev) => [...prev, ...validFiles]);

    // Generate preview URLs
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...urls]);
  };

  // Remove File (Existing or New)
  const removeFile = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Upload Files as FormData
  const handleUpload = async () => {
    if (files.length === 0 && existingFiles.length === 0) {
      GradientWarning("Please select files to upload.");
      return;
    }
  
    const formData = new FormData();
  
    // Append existing files to FormData
    existingFiles.forEach((file) => {
      // Assuming existingFiles are URLs or some other format, you need to convert them to File objects if necessary
      // If they are already File objects, you can append them directly
      formData.append("additionalProfileImages", file);
    });
  
    // Append new files to FormData
    files.forEach((file) => {
      formData.append("additionalProfileImages", file);
    });
  
    console.log([...existingFiles, ...files], "Files being sent");
  
    // Dispatch the action to update the studio images
    await dispatch(updateStudioMultiImage({ doctorId: doctorProfile?._id, data: formData }));
    
    // Fetch the updated doctor profile
    await dispatch(getDoctorProfile(id));
    setFiles([]);
    setPreviewUrls([]);
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
      <h5 className="text-center text-theme text-lg font-semibold mb-3 mt-5">
        Upload Files (Max: {MAX_FILES})
      </h5>

      {/* Upload Button */}
      <label htmlFor="upload-button">
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileChange}
          style={{ display: "none" }}
          id="upload-button"
        />
        <Button
          variant="contained"
          color="primary"
          component="span"
          fullWidth
          disabled={existingFiles.length + files.length >= MAX_FILES}
        >
          Choose Files
        </Button>
      </label>

      {/* File List */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mt: 3,
          justifyContent: "center",
        }}
      >
        {/* Existing Files */}
        {existingFiles.map((url, index) => (
          <Card
            key={`existing-${index}`}
            sx={{ width: 120, height: 120, position: "relative" }}
          >
            <CardMedia
              component="img"
              image={url}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <IconButton
              onClick={() => removeFile(index, true)}
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "rgba(0,0,0,0.5)",
                color: "white",
                "&:hover": { bgcolor: "red" },
                width: "30px",
                height: "30px",
              }}
            >
              x
            </IconButton>
          </Card>
        ))}

        {/* New Uploaded Files */}
        {previewUrls.map((url, index) => {
          const isVideo = files[index]?.type.startsWith("video/");
          return (
            <Card
              key={`new-${index}`}
              sx={{ width: 120, height: 120, position: "relative" }}
            >
              {isVideo ? (
                <video
                  src={url}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <CardMedia
                  component="img"
                  image={url}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              )}
              <IconButton
                onClick={() => removeFile(index, false)}
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": { bgcolor: "red" },
                  width: "30px",
                  height: "30px",
                }}
              >
                x
              </IconButton>
            </Card>
          );
        })}
      </Box>

      {/* Upload Button */}
      <div className="flex items-center justify-center w-full">
        <Button
          onClick={handleUpload}
          variant="contained"
          color="success"
          sx={{ mt: 3 }}
          disabled={files.length === 0}
        >
          Upload Files
        </Button>
      </div>
    </Box>
  );
};

export default UploadFiles;