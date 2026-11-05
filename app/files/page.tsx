"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import {
  deleteFileById,
  getAllPersonalFile,
  PersonalFileProp,
} from "../services/personal-file";
import PrimaryButton from "../components/ui/PrimaryButton";
import Image from "next/image";
import SecondaryButton from "../components/ui/SecondaryButton";
import { IoCloseCircle } from "react-icons/io5";

const imageType: string[] = ["jpeg", "png", "svg+xml"];

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

  const personalList = personalFiles.filter(
    (pf) => pf.category === "Personal File",
  );

  const portfolioAsset = personalFiles.filter(
    (pf) => pf.category === "Portfolio Asset",
  );

  console.log("Test");
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
                {personalList.map((pf, index) => {
                  return (
                    <div key={pf.id} className="w-fit">
                      <div className="delete-btn-wrapper relative left-66 top-4">
                        <IoCloseCircle
                          fill="red"
                          size={30}
                          title="Delete"
                          cursor={"pointer"}
                          onClick={async () => {
                            const confirm: boolean = window.confirm(
                              `Are you sure you want to delete ${pf.title.toUpperCase()} file?`,
                            );

                            if (!confirm) return;

                            deleteFileById(pf.id);

                            //re-fetch to trigger re-render
                            const data = await getAllPersonalFile();
                            setPersonalFiles(data);
                          }}
                        />
                      </div>
                      <div className="border-2 border-green-200 w-70 h-35 flex flex-col gap-5 justify-between p-3 rounded-sm bg-green-100 ">
                        <p
                          key={pf.title + index}
                          title={pf.title}
                          className="flex flex-row gap-3 justify-between items-center"
                        >
                          {pf.title.slice(0, 15)}
                          {pf.title.length > 15 && "..."}
                          <span className="bg-blue-200 rounded-sm p-2 h-fit w-fit flex flex-col justify-center items-center font-bold font-sans text-base">
                            {pf.type.toLocaleUpperCase()}
                          </span>
                        </p>
                        <div className="flex flex-row w-full gap-3 justify-center">
                          <PrimaryButton
                            label="Download"
                            type="button"
                            onClick={async () => {
                              try {
                                const response = await fetch(pf.link);
                                const blob = await response.blob();
                                const blobUrl =
                                  window.URL.createObjectURL(blob);

                                const link = document.createElement("a");
                                link.href = blobUrl;
                                link.download = `${pf.title}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                window.URL.revokeObjectURL(blobUrl);
                              } catch (error) {
                                console.error("Download failed:", error);
                              }
                            }}
                          />

                          <SecondaryButton label="Update" type="button" />
                        </div>
                      </div>
                    </div>
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
                {portfolioAsset.map((pf, index) => {
                  return (
                    <div key={pf.id} className="w-fit">
                      <div className="delete-btn-wrapper relative left-66 top-4">
                        <IoCloseCircle
                          fill="red"
                          size={30}
                          title="Delete"
                          cursor={"pointer"}
                          onClick={async () => {
                            const confirm: boolean = window.confirm(
                              `Are you sure you want to delete ${pf.title.toUpperCase()} file?`,
                            );

                            if (!confirm) return;

                            deleteFileById(pf.id);

                            //re-fetch to trigger re-render
                            const data = await getAllPersonalFile();
                            setPersonalFiles(data);
                          }}
                        />
                      </div>
                      <div className="border-2 border-green-200 w-70 min-h-35 flex flex-col items-center gap-5 justify-between  p-3 rounded-sm bg-green-100 ">
                        {imageType.includes(pf.type) && (
                          <div className="w-50 h-50 relative ">
                            <Image src={pf.link} alt="file image" fill />
                          </div>
                        )}
                        <p
                          key={pf.title + index}
                          title={pf.title}
                          className="flex flex-row gap-3 justify-between items-center"
                        >
                          {pf.title.slice(0, 15)}
                          {pf.title.length > 15 && "..."}
                          <span className="bg-blue-200 rounded-sm p-2 h-fit w-fit flex flex-col justify-center items-center font-bold font-sans text-base">
                            {pf.type.toLocaleUpperCase()}
                          </span>
                        </p>
                        <div className="flex flex-row gap-3 justify-center w-full">
                          <PrimaryButton
                            label="Download"
                            type="button"
                            onClick={async () => {
                              try {
                                const response = await fetch(pf.link);
                                const blob = await response.blob();
                                const blobUrl =
                                  window.URL.createObjectURL(blob);

                                const link = document.createElement("a");
                                link.href = blobUrl;
                                link.download = `${pf.title}`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                window.URL.revokeObjectURL(blobUrl);
                              } catch (error) {
                                console.error("Download failed:", error);
                              }
                            }}
                          />

                          <SecondaryButton label="Update" type="button" />
                        </div>
                      </div>
                    </div>
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
