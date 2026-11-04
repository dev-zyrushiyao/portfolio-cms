import Link from "next/link";
import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

interface ActionHeaderProps {
  linkPath: string;
  buttonLabel: string;
  header: string;
}

export default function ActionHeader({
  linkPath,
  buttonLabel,
}: ActionHeaderProps) {
  return (
    <div>
      <Link href={linkPath}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>{buttonLabel}</h6>
        </div>
      </Link>
    </div>
  );
}
