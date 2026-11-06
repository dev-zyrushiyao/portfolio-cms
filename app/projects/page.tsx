"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdDeleteForever, MdOutlineArrowBackIosNew } from "react-icons/md";
import {
  deleteProjectById,
  getAllProjects,
  ProjectProp,
  removeProjectPhotoById,
} from "../services/project";
import { MdEdit } from "react-icons/md";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import PrimaryButton from "../components/ui/PrimaryButton";
import { IoMdClose } from "react-icons/io";
import { MdNoPhotography } from "react-icons/md";

export default function Project() {
  //the whole list of projects
  const [projectData, setProjectData] = useState<ProjectProp[]>([]);

  //state - pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //sets the page count - pagination
  const totalPages = Math.ceil(projectData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  //input search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  //sliced projects - pagination
  const filteredProjects = projectData.filter((value) =>
    value.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  //pre-coded - pagination
  const getPaginationPages = (current: number, total: number) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  useEffect(() => {
    async function fetchProjects(): Promise<void> {
      const data = await getAllProjects();
      setProjectData(data);
    }
    fetchProjects();
  }, []);

  const container = useRef<HTMLDivElement | null>(null);
  useGSAP(
    () => {
      const projectItem = gsap.utils.toArray<HTMLDivElement>(
        ".project-item",
        container.current,
      );

      const cleanups: (() => void)[] = [];

      projectItem.forEach((item) => {
        const tween = gsap.to(item, {
          paused: true,
          duration: 0.2,
          backgroundColor: "#E5E7EB",
        });

        const onEnter = () => tween.play();
        const onLeave = () => tween.reverse();

        item.addEventListener("mouseenter", () => {
          tween.play();
        });
        item.addEventListener("mouseleave", () => {
          tween.reverse();
        });

        cleanups.push(() => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
          tween.kill();
        });
      });

      // Cleanup on unmount or dependency change
      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: container, dependencies: [currentProjects] },
  );

  async function handleRemovePhoto(project: ProjectProp) {
    const confirm = window.confirm(
      `Are you sure you want to remove [${project.title}] photo?`,
    );

    if (!confirm) {
      return;
    }

    //remove photo from the target id
    await removeProjectPhotoById(project.id);

    //refetch data and re-render new this.state
    const data = await getAllProjects();
    setProjectData(data);
  }

  async function handleDeleteProject(project: ProjectProp) {
    const confirm = window.confirm(
      `Are you sure you want to delete [${project.title}] blog?`,
    );

    if (!confirm) {
      return;
    }
    await deleteProjectById(project.id);

    //refetch data and re-render new this.state
    const data = await getAllProjects();
    setProjectData(data);
  }

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
        <div className="flex lg:flex-row flex-col justify-between">
          <h5>Project List</h5>
          <div className="wrapper flex flex-row gap-5 items-center">
            <div className="search-wrapper p-2 flex flex-row gap-3 items-center border border-gray-500 rounded-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  const newValue = e.currentTarget.value;
                  setSearchQuery(newValue);
                  setCurrentPage(1);
                }}
                placeholder="Search projects.."
                maxLength={40}
                className="p-2 w-[20vw]  text-base"
              />
              <div
                className="cursor-pointer"
                onClick={() => {
                  setSearchQuery("");
                }}
              >
                <IoMdClose />
              </div>
            </div>

            <Link href={"/projects/new"}>
              <PrimaryButton type="button" label="Add Project" />
            </Link>
          </div>
        </div>

        <div ref={container} className="h-100 flex flex-col gap-4">
          {currentProjects.toReversed().map((proj) => {
            return (
              <div
                key={proj.id}
                className="project-item p-5 border border-gray-300 flex flex-row justify-between"
              >
                {proj.title}
                <div className="action-wrapper flex flex-row gap-20">
                  <span
                    className={`icon flex flex-row items-center gap-5 cursor-pointer ${!proj.image_url && "text-gray-300"}`}
                    onClick={async (e) => {
                      e.preventDefault();
                      handleRemovePhoto(proj);
                    }}
                  >
                    <MdNoPhotography /> Remove photo
                  </span>

                  <Link href={`/projects/edit/${proj.id}`}>
                    <span className="icon flex flex-row items-center gap-5">
                      <MdEdit /> Edit
                    </span>
                  </Link>

                  <span
                    className="icon flex flex-row items-center gap-5 cursor-pointer"
                    onClick={async (e) => {
                      e.preventDefault();
                      handleDeleteProject(proj);
                    }}
                  >
                    <MdDeleteForever /> Delete
                  </span>
                </div>
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
