import React, { useState } from "react";
import {
  Button,
  Box,
  Grid,
  Card,
  CardMedia,
  IconButton,
  FormHelperText,
} from "@mui/material";
import { GradientWarning } from "@/api/toastServices";
import { ExInput } from "@/extra/Input"; // Assuming ExInput is a custom input component
import { useSelector } from "react-redux";
import { addonCreate } from "@/store/doctorSlice";
import { useAppDispatch } from "@/store/store";

const StudioAddonsForm: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [quantity, setQuantity] = useState<number | string>("");
  const [addonImage, setAddonImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const { doctorProfile } = useSelector((state: RootStore) => state.doctor);

  const dispatch = useAppDispatch();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    if (file && ["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setAddonImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Clear image error on valid file selection
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.addonImage; // Clear image error if valid file is selected
        return newErrors;
      });
    } else {
      setAddonImage(null); // Clear previous image if file is invalid
      setPreviewUrl(""); // Reset the preview URL
      setErrors((prevErrors) => ({
        ...prevErrors,
        addonImage: "Only JPG, JPEG, and PNG files are allowed.",
      }));
      GradientWarning("Only JPG, JPEG, and PNG files are allowed.");
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setAddonImage(null);
    setPreviewUrl(""); // Reset preview URL
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      delete newErrors.addonImage; // Remove image error on removal
      return newErrors;
    });
  };

  // Validate fields
  const validateForm = () => {
    let formErrors: { [key: string]: string } = {};
    if (!name) formErrors.name = "Addon Name is required.";
    if (!price) formErrors.price = "Price is required.";
    if (!quantity) formErrors.quantity = "Quantity is required.";
    if (!addonImage) formErrors.addonImage = "Addon image is required.";

    setErrors(formErrors);

    return Object.keys(formErrors).length === 0; // Return true if no errors
  };

  // Handle input change and clear error
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    switch (field) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "quantity":
        setQuantity(value);
        break;
      default:
        break;
    }

    // Clear error for the field when the user starts typing
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[field]) delete newErrors[field];
      return newErrors;
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Create a FormData object
      const formData = new FormData();
      formData.append("doctorId", doctorProfile?._id || "");
      formData.append("addonName", name);
      formData.append("description", description);
      formData.append("price", price.toString());
      formData.append("quantity", quantity.toString());

      if (addonImage) {
        formData.append("addonImage", addonImage);
      }

      // Dispatch FormData instead of JSON payload
      await dispatch(addonCreate(formData));
      
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      console.error("Error creating addon:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, borderRadius: 2, bgcolor: "white" }}>
      {/* Back Button */}
      <Grid item xs={12}>
        <div className="flex items-center justify-center w-full"></div>
      </Grid>

      <Grid container spacing={3}>
        {/* Name Input */}
        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonName"
            name="addonName"
            value={name}
            label={<span>Addon Name <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter Addon Name"
            onChange={(e) => handleInputChange(e, "name")}
            error={!!errors.name} // Error flag
          />
          {errors.name && (
            <FormHelperText error>{errors.name}</FormHelperText> // Custom error message display
          )}
        </Grid>

        {/* Description Input */}
        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonDescription"
            name="addonDescription"
            value={description}
            label="Description"
            placeholder="Enter Addon Description"
            onChange={(e) => handleInputChange(e, "description")}
            error={!!errors.description} // Error flag
          />

        </Grid>

        {/* Price Input */}
        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonPrice"
            name="addonPrice"
            value={price}
            label={<span>Price <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter Price"
            onChange={(e) => handleInputChange(e, "price")}
            // type="number"
            error={!!errors.price} // Error flag
          />
          {errors.price && (
            <FormHelperText error>{errors.price}</FormHelperText> // Custom error message display
          )}
        </Grid>

        {/* Quantity Input */}
        <Grid item xs={12} sm={6}>
          <ExInput
            id="addonQuantity"
            name="addonQuantity"
            value={quantity}
            label={<span>Quantity <span style={{ color: 'red' }}>*</span></span>}
            placeholder="Enter Quantity"
            onChange={(e) => handleInputChange(e, "quantity")}
            // type="number"
            error={!!errors.quantity} // Error flag
          />
          {errors.quantity && (
            <FormHelperText error>{errors.quantity}</FormHelperText> // Custom error message display
          )}
        </Grid>

        {/* Addon Image Input */}
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
              Upload Addon Image <span style={{ color: 'red' }}>*</span>
            </Button>
          </label>
          {errors.addonImage && (
            <FormHelperText error>{errors.addonImage}</FormHelperText> // Custom error message display
          )}
        </Grid>

        {/* Image preview with remove button */}
        {previewUrl && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
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
                  width: "30px",
                  height: "30px",
                }}
              >
                x
              </IconButton>
            </Card>
          </Grid>
        )}

        {/* Submit Button */}
        <Grid item xs={12}>
          <div
            className="flex  w-full "
            style={{ justifyContent: "end", display: "flex" }}
          >
            <Button
              onClick={onBack}
              color="inherit"
              variant="outlined"
              type={`button`}
              sx={{ mt: 3, mr: 4 }}
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              style={{ backgroundColor: "#1ebc1e" }}
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Addon"}
            </Button>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudioAddonsForm;
