import React, { useState } from "react";
import {
  Button,
  Box,
  Grid,
  IconButton,
  Card,
  CardMedia,
  FormHelperText,
} from "@mui/material";
import { GradientWarning } from "@/api/toastServices";
import { ExInput } from "@/extra/Input";
import { useSelector } from "react-redux";
import { RootStore, useAppDispatch } from "@/store/store";
import { updateAddon } from "@/store/doctorSlice";

interface AddonData {
  id: number;
  addonName: string;
  description: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const StudioAddonsEditForm: React.FC<{
  addonData: AddonData;
  onBack: () => void;
}> = ({ addonData, onBack }) => {
  const [addonName, setAddonName] = useState<string>(addonData.addonName || "");
  const [description, setDescription] = useState<string>(
    addonData.description || ""
  );
  const [price, setPrice] = useState<number | string>(addonData.price || "");
  const [quantity, setQuantity] = useState<number | string>(
    addonData.quantity || ""
  );
  const [addonImage, setAddonImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    addonData.imageUrl || ""
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { doctorProfile } = useSelector((state: RootStore) => state.doctor);
  const dispatch = useAppDispatch();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setAddonImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.addonImage;
        return newErrors;
      });
    } else {
      setAddonImage(null);
      setPreviewUrl("");
      setErrors((prevErrors) => ({
        ...prevErrors,
        addonImage: "Only JPG, JPEG, and PNG files are allowed.",
      }));
      GradientWarning("Only JPG, JPEG, and PNG files are allowed.");
    }
  };

  const handleRemoveImage = () => {
    setAddonImage(null);
    setPreviewUrl("");
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.addonImage;
      return newErrors;
    });
  };

  const validateForm = () => {
    let formErrors: { [key: string]: string } = {};
    if (!addonName.trim()) formErrors.addonName = "Addon Name is required.";
    if (!description.trim())
      formErrors.description = "Description is required.";
    if (!price) formErrors.price = "Price is required.";
    if (!quantity) formErrors.quantity = "Quantity is required.";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Create a new FormData instance
    const formData = new FormData();

    // Append form fields to the FormData object (excluding id and doctorId)
    formData.append("addonName", addonName);
    formData.append("description", description);
    formData.append("price", String(price));
    formData.append("quantity", String(quantity));
    formData.append("doctorId", addonData?.doctorId?._id);

    // Append the image if it's selected
    if (addonImage) {
      formData.append("addonImage", addonImage);
    }

    // Now dispatch the updateAddon with the formData
    const { _id } = addonData; // Extract the id from addonData
    dispatch(updateAddon({ id: _id, formData }));
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonName"
            name="addonName"
            value={addonName}
            label="Addon Name"
            placeholder="Enter Addon Name"
            onChange={(e) => setAddonName(e.target.value)}
            error={!!errors.addonName}
          />
          {errors.addonName && (
            <FormHelperText error>{errors.addonName}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonDescription"
            name="addonDescription"
            value={description}
            label="Description"
            placeholder="Enter Addon Description"
            onChange={(e) => setDescription(e.target.value)}
            error={!!errors.description}
          />
          {errors.description && (
            <FormHelperText error>{errors.description}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonPrice"
            name="addonPrice"
            value={price}
            label="Price"
            placeholder="Enter Price"
            onChange={(e) => setPrice(e.target.value)}
            error={!!errors.price}
          />
          {errors.price && (
            <FormHelperText error>{errors.price}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonQuantity"
            name="addonQuantity"
            value={quantity}
            label="Quantity"
            placeholder="Enter Quantity"
            onChange={(e) => setQuantity(e.target.value)}
            error={!!errors.quantity}
          />
          {errors.quantity && (
            <FormHelperText error>{errors.quantity}</FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <label htmlFor="addonImage">
            <input
              type="file"
              accept="image/*"
              id="addonImage"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload Addon Image
            </Button>
          </label>
          {errors.addonImage && (
            <FormHelperText error>{errors.addonImage}</FormHelperText>
          )}
        </Grid>

        {previewUrl && (
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", mt: 2 }}
          >
            <Card sx={{ width: 120, height: 120, position: "relative" }}>
              <CardMedia
                component="img"
                image={previewUrl}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                onClick={handleRemoveImage}
                size="small"
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(0,0,0,0.5)",
                  color: "white",
                  "&:hover": { bgcolor: "red" },
                }}
              >
                x
              </IconButton>
            </Card>
          </Grid>
        )}

        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "end", gap: 2 }}
        >
          <Button onClick={onBack} color="inherit" variant="outlined">
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            style={{ backgroundColor: "#1ebc1e" }}
            disabled={!addonName.trim() || !price || !quantity}
          >
            Update Addon
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudioAddonsEditForm;
