"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import {
  deleteFileById,
  getAllPersonalFile,
  PersonalFileProp,
  updateFileById,
} from "../services/personal-file";
import PrimaryButton from "../components/ui/PrimaryButton";
import FilesCard from "../components/ui/FilesCard";

export default function FilePage() {
  const [personalFiles, setPersonalFiles] = useState<PersonalFileProp[] | []>(
    [],
  );

  useEffect(() => {
    async function fetchFiles() {
      const data = await getAllPersonalFile();
      setPersonalFiles(data);
    }

    fetchFiles();
  }, []);

  const personalList = personalFiles.filter((pf) => pf.category === "Personal");

  const portfolioAsset = personalFiles.filter((pf) => pf.category === "Asset");

  async function handleDelete(personalFile: PersonalFileProp) {
    const confirm: boolean = window.confirm(
      `Are you sure you want to delete ${personalFile.title.toUpperCase()} file?`,
    );
    if (!confirm) return;
    await deleteFileById(personalFile.id);

    //re-fetch to trigger re-render
    const data = await getAllPersonalFile();
    setPersonalFiles(data);
  }

  async function handleUpdate(personalFile: PersonalFileProp) {
    await updateFileById(personalFile.id);

    const data = await getAllPersonalFile();
    setPersonalFiles(data);
  }

  async function handleDownload(personalFile: PersonalFileProp) {
    try {
      const response = await fetch(personalFile.link);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${personalFile.title}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

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
          <h5>File List</h5>
          <Link href={"/files/new"}>
            <PrimaryButton type="button" label="Add Files" />
          </Link>
        </div>
        <div className="wrapper p-10 flex flex-col gap-10">
          <section className="personal ">
            <h5>Personal:</h5>
            {personalList.length === 0 ? (
              <div className="bg-gray-300 p-10 text-center">
                <p>No data found</p>
              </div>
            ) : (
              <div className="flex flex-row gap-10 items-center flex-wrap">
                {personalList.toReversed().map((file) => {
                  return (
                    <FilesCard
                      key={file.id}
                      personalFileProp={file}
                      displayImage={false}
                      handleDelete={async () => {
                        await handleDelete(file);
                      }}
                      handledownload={async () => {
                        await handleDownload(file);
                      }}
                      handleUpdate={async () => {
                        await handleUpdate(file);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>
          <section className="asset ">
            <h5>Portfolio Asset:</h5>
            {portfolioAsset.length === 0 ? (
              <div className="bg-gray-300 p-10 text-center">
                <p>No data found</p>
              </div>
            ) : (
              <div className="flex flex-row gap-10 flex-wrap">
                {portfolioAsset.toReversed().map((file) => {
                  return (
                    <FilesCard
                      key={file.id}
                      personalFileProp={file}
                      displayImage
                      handleDelete={async () => {
                        await handleDelete(file);
                      }}
                      handledownload={async () => {
                        await handleDownload(file);
                      }}
                      handleUpdate={async () => {
                        await handleUpdate(file);
                      }}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
