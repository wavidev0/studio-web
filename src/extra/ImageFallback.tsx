import React, { CSSProperties, useState } from "react";

import noImage1 from "@/assets/images/noimage1.png";
// import LoadingGif from "../assets/images/loading_gray.gif";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: any;
  noImage?: string;
  width?: string | number;   // optional
  height?: string | number;  // required
  style?: CSSProperties;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  noImage = noImage1,
  width,
  height,
  style,
  ...props
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ position: "relative", width, height }}>
      {/* Loader */}
      {loading && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f0f0f0",
              borderRadius: 5,
            }}
          >
          </div>
        </>
      )}

      {/* Image */}
      <img
        className="img-fluid"
        style={{
          height,
          width,
          boxShadow: "0 5px 15px 0 rgb(105 103 103 / 0%)",
          border: "0.5px solid rgba(255, 255, 255, 0.20)",
          borderRadius: 5,
          objectFit: "cover",
          ...style
        }}
        src={src || `/images/user.jpg`}
        onLoad={() => setLoading(false)}
        alt=""
        {...props}
      />
    </div>
  );
};

export default LazyImage;
