"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { getProjects, ProjectProp } from "../services/project";
import { MdEdit } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Project() {
  //the whole list of projects
  const [projectData, setProjectData] = useState<ProjectProp[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //sets the page count
  const totalPages = Math.ceil(projectData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  //sliced projects
  const currentProjects = projectData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  //pre-coded
  const getPaginationPages = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  useEffect(() => {
    async function fetchProjects() {
      const data = await getProjects();
      setProjectData(data);
    }
    fetchProjects();
  }, []);

  const container = useRef<HTMLDivElement | null>(null);
  // useGSAP(
  //   () => {
  //     async function fetchProjects() {
  //       const data = await getProjects();
  //       setProjectData(data);
  //     }
  //     fetchProjects();

  //     const projectItem = gsap.utils.toArray<HTMLDivElement>(
  //       ".project-item",
  //       container.current,
  //     );

  //     projectItem.forEach((item) => {
  //       console.log(item);
  //       const tween = gsap.to(item, {
  //         paused: true,
  //         duration: 0.2,
  //         backgroundColor: "#E5E7EB",
  //       });
  //       item.addEventListener("mouseenter", () => {
  //         tween.play();
  //       });
  //       item.addEventListener("mouseleave", () => {
  //         tween.reverse();
  //       });
  //     });
  //   },
  //   { scope: container, dependencies: [currentProjects] },
  // );

  return (
    <div className="flex flex-col gap-10 p-20">
      <Link href={"/dashboard"}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>View Projects</h6>
        </div>
      </Link>
      <div className="flex flex-col gap-5">
        <h5>Project List</h5>
        <div ref={container} className="h-100 flex flex-col gap-4">
          {currentProjects.map((proj) => {
            return (
              <div
                key={proj.id}
                className="project-item p-5 border border-gray-300 flex flex-row justify-between"
              >
                {proj.title}
                <Link href={`/projects/edit/${proj.id}`}>
                  <span className="icon flex flex-row items-center gap-5">
                    <MdEdit /> Edit
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-row gap-5 justify-center">
        <button
          disabled={currentPage === 1}
          className="border border-gray-500 p-5 cursor-pointer"
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          {"Prev"}
        </button>
        {getPaginationPages(currentPage, totalPages).map((page, index) =>
          page === "..." ? (
            <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            // number - pages buttons
            <button
              key={page}
              onClick={() => setCurrentPage(page as number)}
              className={`border border-gray-500 p-5 cursor-pointer ${
                currentPage === page ? "bg-gray-300 font-bold" : ""
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          className="border border-gray-500 p-5 cursor-pointer"
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {"Next"}
        </button>
      </div>
    </div>
  );
}
