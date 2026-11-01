import Link from "next/link";
import React from "react";

export default function ActionMenu() {
  return (
    <div className="left-content w-fit p-2">
      <h5>Action Menu</h5>
      <div className="action-list p-5">
        <ul className="flex flex-col gap-2">
          <li className="">
            <Link href={"/blogs"}>
              <p>View Blog</p>
            </Link>
          </li>
          <li>
            <Link href={"/files"}>
              <p>View Files</p>
            </Link>
          </li>
          <li>
            <Link href={"/projects"}>
              <p>View Projects</p>
            </Link>
          </li>
          <li>
            <Link href={"/techstacks"}>
              <p>View Techstack</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
