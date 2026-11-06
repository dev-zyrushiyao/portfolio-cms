"use client";

import ActionHeader from "@/app/components/ui/ActionHeader";
import PrimaryButton from "@/app/components/ui/PrimaryButton";
import { postFile } from "@/app/services/personal-file";

import React from "react";
import { toast } from "sonner";

const fileSelection = ["Personal", "Asset"];

export default function NewFile() {
  return (
    <main className="flex flex-col gap-10 p-20">
      <ActionHeader
        linkPath="/files"
        buttonLabel="Upload New File"
        header="Upload File"
      />
      <div className="flex flex-col gap-5">
        <div className="flex lg:flex-row flex-col justify-between">
          <h5>Upload</h5>
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            //raw <form>
            const formElement = event.currentTarget;

            //create a new Form with same inputs
            const formData = new FormData(event.currentTarget);

            //invoke the post method
            const result = await postFile(formData);

            try {
              if (result?.success) {
                toast.success(result.message);

                // 2. Clear the file input and dropdown back to default
                formElement.reset();
              } else {
                toast.error(result?.message || "Something went wrong");
              }
            } catch (error) {
              toast.error(`An unexpected error occurred. ${error}`);
            }
          }}
        >
          <div className="lg:h-full h-50 w-fit p-20 bg-gray-200 flex flex-col justify-center items-center gap-5">
            <label>Project Photo</label>
            <div className="flex flex-row items-center gap-5">
              <label htmlFor="category-dropdown">Category:</label>
              <select
                name="category"
                id="category-dropdown"
                className="border p-3 bg-white"
              >
                {fileSelection.map((fs) => {
                  return <option key={fs}>{fs}</option>;
                })}
              </select>
            </div>

            <div className="flex flex-col text-center">
              <input
                required
                name="file"
                type="file"
                accept="image/png, image/jpeg, application/pdf, image/svg+xml"
                className="file:rounded-xs file:flex file:flex-col file:w-full  file:mr-4 file:py-2 file:px-4 file:border file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
            <PrimaryButton label="upload" type="submit" />
          </div>
        </form>
      </div>
    </main>
  );
}
