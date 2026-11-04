import Link from "next/link";
import React from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

export default function page() {
  return (
    <div className="flex flex-col gap-10 p-20">
      <Link href={"/dashboard"}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>View files</h6>
        </div>
      </Link>
      <div className="flex flex-col gap-5">
        <div className="flex lg:flex-row flex-col justify-between">
          <h5>File List List</h5>
        </div>
      </div>
    </div>
  );
}
