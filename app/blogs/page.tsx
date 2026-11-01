"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdEdit, MdOutlineArrowBackIosNew } from "react-icons/md";
import { BlogProp, deleteBlog, getAllBlogs } from "../services/blog";
import { IoMdClose } from "react-icons/io";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";

export default function Blogs() {
  //the whole list of projects
  const [blogData, setBlogData] = useState<BlogProp[]>([]);

  //state - pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //sets the page count - pagination
  const totalPages = Math.ceil(blogData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  //input search state
  const [searchQuery, setSearchQuery] = useState<string>("");

  //sliced projects - pagination
  const filteredBlogs = blogData.filter((value) =>
    value.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const currentBlogs = filteredBlogs.slice(
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
    async function fetchBlogs() {
      const data = await getAllBlogs();
      setBlogData(data);
    }

    fetchBlogs();
  }, []);

  //Gsap animation
  const container = useRef<HTMLDivElement | null>(null);
  const { contextSafe } = useGSAP(() => {}, {
    scope: container,
    dependencies: [blogData],
  });

  function handleMouseEnter(e: React.MouseEvent) {
    const context = contextSafe(() => {
      //animation
      gsap.to(e.currentTarget, {
        duration: 0.2,
        backgroundColor: "#E5E7EB",
      });
    });

    context();
  }

  function handleMouseLeave(e: React.MouseEvent) {
    const context = contextSafe(() => {
      //animation
      gsap.to(e.currentTarget, {
        duration: 0.2,
        backgroundColor: "white",
      });
    });

    context();
  }

  async function handleBlogDelete(id: number) {
    try {
      await deleteBlog(id);

      // Update state locally
      setBlogData((prev) => prev.filter((blog) => blog.id !== id));

      // Trigger success toast
      toast.success("Blog deleted successfully!");
    } catch (error) {
      toast.error(`Failed to delete blog. ${error}`);
    }
  }

  return (
    <div className="flex flex-col gap-10 p-20">
      <Link href={"/dashboard"}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>View Blogs</h6>
        </div>
      </Link>
      <div className="flex flex-col gap-5">
        <div className="flex lg:flex-row flex-col justify-between">
          <h5>Blog List</h5>
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

            <Link href={"/blogs/new"}>
              <PrimaryButton label="Add Blog" />
            </Link>
          </div>
        </div>

        <div ref={container} className="h-100 flex flex-col gap-4">
          {currentBlogs.map((blog) => {
            return (
              <div
                key={blog.id}
                className="blog-item p-5 border border-gray-300 flex flex-row justify-between"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {blog.title}
                <div className="action-wrapper flex flex-row gap-20">
                  <Link href={`/blogs/edit/${blog.id}`}>
                    <span className="icon flex flex-row items-center gap-5">
                      <MdEdit /> Edit
                    </span>
                  </Link>
                  <span
                    className="icon flex flex-row items-center gap-5 cursor-pointer"
                    defaultValue={blog.id}
                    onClick={(e) => {
                      if (
                        !window.confirm(
                          `Are you sure you want to delete [${blog.title}] blog?`,
                        )
                      ) {
                        e.preventDefault();
                      } else {
                        handleBlogDelete(blog.id);
                      }
                    }}
                  >
                    <MdDeleteForever /> Delete
                  </span>
                </div>
              </div>
            );
          })}
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
    </div>
  );
}
