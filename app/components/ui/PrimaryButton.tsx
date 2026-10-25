import React, { useEffect } from "react";

export default function PrimaryButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  //   useEffect(() => {}, [label]);

  return (
    <button
      className="bg-amber-300 p-1 w-[10vw] rounded-2xl cursor-pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
