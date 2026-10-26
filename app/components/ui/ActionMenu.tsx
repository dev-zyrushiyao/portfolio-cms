import Link from "next/link";
import React from "react";

export default function ActionMenu() {
  return (
    <div className="left-content w-fit p-2">
      <h5>Action Menu</h5>
      <div className="action-list p-5">
        <ul className="flex flex-col gap-2">
          <li className="">
            <Link href={"/blog"}>
              <p>Add Blog</p>
            </Link>
          </li>
          <li>
            <Link href={"/files"}>
              <p>Add Files</p>
            </Link>
          </li>
          <li>
            <Link href={"/projects"}>
              <p>Add Projects</p>
            </Link>
          </li>
          <li>
            <Link href={"/techstack"}>
              <p>Add Techstack</p>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
