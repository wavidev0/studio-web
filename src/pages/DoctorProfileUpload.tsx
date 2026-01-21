import React, { useState, useEffect } from "react";
import { GradientWarning } from "@/api/toastServices";
import { 
  Button, 
  IconButton, 
  Box, 
  Card, 
  CardMedia, 
  Typography,
  Chip,
  Paper
} from "@mui/material";
import { 
  MdCloudUpload,
  MdDelete,
  MdImage,
  MdVideoFile
} from "react-icons/md";
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
    <>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
      <h5 className="text-2xl font-semibold text-theme mb-2">
          Studio Media Gallery
        </h5>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Showcase your studio with high-quality images and videos
        </Typography>
        <Chip 
          label={`${existingFiles.length + files.length}/${MAX_FILES} files`}
          color={existingFiles.length + files.length >= MAX_FILES ? "error" : "primary"}
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      </Box>

      {/* Upload Area */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<MdCloudUpload />}
          disabled={existingFiles.length + files.length >= MAX_FILES}
          sx={{ 
            mb: 2, 
            px: 4, 
            py: 1.5,
            borderRadius: 2,
            borderColor: '#3498db',
            color: '#3498db',
            '&:hover': {
              borderColor: '#2980b9',
              bgcolor: '#f8f9ff'
            }
          }}
        >
          {existingFiles.length + files.length >= MAX_FILES 
            ? "Maximum files reached" 
            : "Choose Files"
          }
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          Supported formats: JPG, PNG, MP4, AVI, MOV
        </Typography>
      </Box>

      {/* File Grid */}
      {(existingFiles.length > 0 || files.length > 0) && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 500, color: '#34495e', textAlign: 'center' }}>
            Media Preview
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
              gap: 3,
              justifyItems: "center"
            }}
          >
            {/* Existing Files */}
            {existingFiles.map((url, index) => (
              <Paper 
                key={`existing-${index}`} 
                elevation={3}
                sx={{ 
                  position: 'relative',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
              >
                <img
                  src={url}
                  alt="existing"
                  style={{ width: 160, height: 160, objectFit: 'cover', display: 'block' }}
                />
                <Chip
                  label="Saved"
                  size="small"
                  color="success"
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    fontSize: '0.7rem',
                    fontWeight: 600
                  }}
                />
                <IconButton
                  onClick={() => removeFile(index, true)}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(231, 76, 60, 0.9)',
                    color: 'white',
                    width: 28,
                    height: 28,
                    '&:hover': { 
                      bgcolor: '#c0392b',
                      transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MdDelete size={16} />
                </IconButton>
              </Paper>
            ))}

            {/* New Files */}
            {previewUrls.map((url, index) => {
              const isVideo = files[index]?.type.startsWith("video/");
              return (
                <Paper 
                  key={`new-${index}`} 
                  elevation={3}
                  sx={{ 
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  {isVideo ? (
                    <video
                      src={url}
                      style={{ width: 160, height: 160, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <img
                      src={url}
                      alt="new"
                      style={{ width: 160, height: 160, objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  <Chip
                    icon={isVideo ? <MdVideoFile /> : <MdImage />}
                    label="New"
                    size="small"
                    color="primary"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      fontSize: '0.7rem',
                      fontWeight: 600
                    }}
                  />
                  <IconButton
                    onClick={() => removeFile(index, false)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(231, 76, 60, 0.9)',
                      color: 'white',
                      width: 28,
                      height: 28,
                      '&:hover': { 
                        bgcolor: '#c0392b',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <MdDelete size={16} />
                  </IconButton>
                </Paper>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Upload Button */}
      <Box sx={{ textAlign: 'right', pt: 2, borderTop: '1px solid #ecf0f1' }}>
        <Button
          onClick={handleUpload}
          variant="contained"
          startIcon={<MdCloudUpload />}
          disabled={files.length === 0}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            bgcolor: '#27ae60',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#229954',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
            },
            '&:disabled': {
              bgcolor: '#bdc3c7'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Upload Files
        </Button>
      </Box>
    </>
  );
};

export default UploadFiles;