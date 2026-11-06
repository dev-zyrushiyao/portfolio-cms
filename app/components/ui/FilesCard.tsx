import React from "react";
import SecondaryButton from "./SecondaryButton";
import { PersonalFileProp } from "@/app/services/personal-file";
import { IoCloseCircle } from "react-icons/io5";
import PrimaryButton from "./PrimaryButton";
import Image from "next/image";
import defaultImg from "@/public/default_img.png";

interface FilesCardProp {
  personalFileProp: PersonalFileProp;
  handleDelete: () => void | Promise<void>;
  handledownload: () => void | Promise<void>;
  handleUpdate: () => void | Promise<void>;
  displayImage: boolean;
}

const imageType: string[] = ["jpeg", "png", "svg", "svg+xml"];

export default function FilesCard({
  personalFileProp,
  handleDelete,
  handledownload,
  handleUpdate,
  displayImage = true,
}: FilesCardProp) {
  return (
    <div className="w-fit">
      <div className="delete-btn-wrapper relative left-66 top-4">
        <IoCloseCircle
          fill="red"
          size={30}
          title="Delete"
          cursor={"pointer"}
          onClick={handleDelete}
        />
      </div>
      <div className="border-2 border-green-500 w-70 min-h-35 max-h-80 flex flex-col gap-5 justify-between items-center p-3 rounded-sm bg-green-200 ">
        {displayImage && (
          <div className="w-50 h-50 relative">
            <Image
              src={
                imageType.includes(personalFileProp.type)
                  ? personalFileProp.link
                  : defaultImg
              }
              alt="file image"
              loading="eager"
              sizes="200px"
              fill
              className="object-cover"
            />
          </div>
        )}
        <p
          title={personalFileProp.title}
          className="flex flex-row gap-3 justify-between items-center w-full "
        >
          {personalFileProp.title.slice(0, 15)}
          {personalFileProp.title.length > 15 && "..."}
          <span className="bg-blue-200 rounded-sm p-2 h-fit w-fit flex flex-col justify-center items-center font-bold font-sans text-base">
            {personalFileProp.type.toLocaleUpperCase()}
          </span>
        </p>
        <div className="flex flex-row w-full gap-3 justify-center">
          <PrimaryButton
            label="Download"
            type="button"
            onClick={handledownload}
          />

          <SecondaryButton
            label={
              personalFileProp.category === "Personal" ? "Asset" : "Personal"
            }
            type="button"
            onClick={handleUpdate}
          />
        </div>
      </div>
    </div>
  );
}
