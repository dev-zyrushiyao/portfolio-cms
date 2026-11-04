import ActionHeader from "@/app/components/ui/ActionHeader";
import React from "react";

export default function page() {
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

        <form action="">
          <div className="lg:h-full h-50 w-fit p-20 bg-gray-200 flex flex-col justify-center items-center gap-5">
            <label>Project Photo</label>
            <div className="flex flex-col text-center">
              <input
                required
                name="image_url"
                type="file"
                accept="image/png"
                className="file:rounded-xs file:flex file:flex-col file:w-full  file:mr-4 file:py-2 file:px-4 file:border file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
