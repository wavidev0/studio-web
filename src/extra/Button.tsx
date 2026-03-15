"use client";

export default function Button({
  onClick,
  disabled,
  text,
  aIcon,
  bIcon,
  className,
  type,
  style,
  btnColor,
  title,
}: any) {
  return (
    <>
      <button
        className={`themeBtn text-center ${className} ${btnColor}`}
        onClick={onClick}

        disabled={disabled}
        type={type}
      >
        {bIcon ?
          <>
            {bIcon} <span className="">{text}</span>
          </>
          : text}
      </button>
    </>
  );
}
