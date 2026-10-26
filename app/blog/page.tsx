"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

import { getStorageImage, TechstackProp } from "../services/storage";
import { addProject } from "../services/project";
import { TagProp } from "../services/project";

export default function Blog() {
  const [techstackImages, setTechstackImages] = useState<
    TechstackProp[] | null
  >(null);

  useEffect(() => {
    async function fetchImages() {
      const data = await getStorageImage();
      setTechstackImages(data);
    }

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col gap-10 p-20">
      <Link href={"/"}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>Back</h6>
        </div>
      </Link>
      <h5>Add Project</h5>
      <form action={addProject} className="flex flex-col gap-5">
        <div className="flex flex-col">
          <label htmlFor="title-label" className="text-xl">
            Title:
          </label>
          <input
            maxLength={40}
            type="text"
            name="title"
            id="title-label"
            className="border border-gray-300 rounded-sm p-3 text-base"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="description-desktop-label" className="text-xl">
            Description - desktop
          </label>

          <textarea
            className="h-50 border border-gray-300 rounded-sm p-3 text-base"
            name="description_desktop"
            id="description-desktop-label"
            cols={5}
            rows={5}
            defaultValue={""}
            maxLength={500}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label htmlFor="description-mobile-label" className="text-xl">
            Description - mobile
          </label>

          <textarea
            className="h-30 border border-gray-300 rounded-sm p-3 text-base"
            name="description_mobile"
            id="description-mobile-label"
            cols={5}
            rows={5}
            defaultValue={""}
            maxLength={250}
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="text-xl">Techstack</label>
          <div className="ts-wrapper h-50 flex flex-col flex-wrap">
            {techstackImages?.map((ts) => {
              return (
                <div key={ts.originalName} className="flex flex-row gap-2">
                  <input
                    type="checkbox"
                    name="tags"
                    value={JSON.stringify({
                      name: ts.fileName,
                      icon_url: ts.url,
                    } as TagProp)}
                    id={`${ts.fileName}-input`}
                  />
                  <label htmlFor={`${ts.fileName}-input`} className="text-base">
                    {ts.fileName}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <div className="url-file-divider flex flex-row gap-5">
          <div className="url-wrapper flex flex-col w-full">
            <div className="flex flex-col">
              <label htmlFor="demo-label" className="text-xl">
                Demo URL:
              </label>
              <input
                defaultValue={""}
                type="text"
                name="demo_url"
                id="demo-label"
                className="border border-gray-300 rounded-sm p-3 text-base"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="docu-label" className="text-xl">
                Documentation URL:
              </label>
              <input
                defaultValue={""}
                type="text"
                name="documentation_url"
                id="docu-label"
                className="border border-gray-300 rounded-sm p-3 text-base"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="prototype-label" className="text-xl">
                Prototype URL:
              </label>
              <input
                defaultValue={""}
                type="text"
                name="prototype_url"
                id="prototype-label"
                className="border border-gray-300 rounded-sm p-3 text-base"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="github-label" className="text-xl">
                Github URL:
              </label>
              <input
                defaultValue={""}
                type="text"
                name="github_url"
                id="github-label"
                className="border border-gray-300 rounded-sm p-3 text-base"
              />
            </div>
          </div>
          <div className="file-wrapper w-full">
            <div className="h-full bg-gray-200 flex flex-col justify-center items-center gap-5">
              <label>Project Photo</label>
              <div className="flex flex-col">
                <input
                  required
                  name="image_url"
                  type="file"
                  accept="image/png"
                  className="file:rounded-xs file:mr-4 file:py-2 file:px-4 file:border file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
        <button type="submit" className="bg-yellow-200 p-5 border rounded-xl">
          Add Project
        </button>
      </form>
    </div>
  );
}
