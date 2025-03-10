import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Card, CardMedia, IconButton, Typography } from "@mui/material";

const DoctorImageSlider: React.FC = () => {
  const { doctorProfile } = useSelector((state: RootStore) => state.doctor);
  if (!doctorProfile) return null;

  const { image, additionalProfileImages = [] } = doctorProfile;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [allImages, setAllImages] = useState<string[]>([]);
  useEffect(() => {
    if(additionalProfileImages.length>0){
    // Ensure the main image is included in the slideshow
    const updatedImages = [image, ...additionalProfileImages.filter(Boolean)];
    setAllImages(updatedImages);
    setCurrentIndex(0); // Reset index when images 
    }
  }, [image, additionalProfileImages]);

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % allImages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [allImages]); // Depend on allImages to avoid stale length issues

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        width: "100%",
      }}
    >
      <Card
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          width: 250,
          height: 250,
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt="Doctor Profile"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Card>

      {allImages.length > 1 && (
        <Box sx={{ position: "relative", width: 380, mt: 2 }}>
          <Typography
            variant="h6"
            align="center"
            className="text-theme mb-3 mt-5"
          >
            Additional Images
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={handlePrev}
              sx={{ position: "relative", left: 5, zIndex: 2 }}
            >
              {"<"}
            </IconButton>
            <Card
              sx={{
                borderRadius: "10px",
                overflow: "hidden",
                width: 175,
                height: 175,
              }}
            >
              <CardMedia
                component="img"
                image={allImages[currentIndex] || ""}
                alt={`Additional Image ${currentIndex}`}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Card>
            <IconButton
              onClick={handleNext}
              sx={{ position: "relative", right: 5, zIndex: 2 }}
            >
              {">"}
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default DoctorImageSlider;
