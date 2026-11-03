"use client";

import { uploadBlogMediaToStorage } from "@/app/services/storage";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { postBlog } from "@/app/services/blog";
import PrimaryButton from "@/app/components/ui/PrimaryButton";
import { toast } from "sonner";
import type ReactQuillInstance from "react-quill-new";

// Import Quill dynamically with SSR turned off
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
}) as React.ComponentType<
  React.ComponentProps<typeof ReactQuillInstance> &
    React.RefAttributes<ReactQuillInstance>
>;

export default function NewBlog() {
  const [content, setContent] = useState<string>("");
  const quillRef = useRef<ReactQuillInstance | null>(null);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: ["ordered", "unordered"] }, { list: "bullet" }],
        ["link", "image", "video"],
        ["clean"],
      ],
      handlers: {
        image: handleCustomImage,
      },
    },
  };

  async function handleCustomImage() {
    //create a input-file element
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/png");
    input.click();
    input.onchange = async () => {
      //select the first file(not supported multiple uploads)
      const file = input.files?.[0];

      if (!file) return;

      try {
        //upload the media and return as image url
        const imageUrl = await uploadBlogMediaToStorage(file);

        //access the Quill editor
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        //get the cursor position (range)
        //if range exist store it to index variable else use the end of the document editor
        const range = editor.getSelection(true);
        const index = range ? range.index : editor.getLength();

        //index where to insert image
        //"image" - type of content to insert
        //imageUrl - image source
        //"user|api|silent" - source
        editor.insertEmbed(index, "image", imageUrl, "user");

        //index + 1 moves the cursor after the image
        //0 - no selected text
        editor.setSelection(index + 1, 0);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload image.");
      }
    };
  }

  const [state, formAction] = useActionState(postBlog, null);
  useEffect(() => {
    const blogLink: string = `zyrushiyao-portfolio/blogs/`;
    if (state?.success) {
      toast.success(state.message, {
        action: {
          label: "view",
          onClick() {
            window.open(blogLink, "_blank");
          },
        },
      });
      toast.dismiss("loading-toast");
    } else if (state?.success === false) {
      toast.error(`${state.message}`);
      toast.dismiss("loading-toast");
    }
  }, [state]);

  return (
    <div className="flex flex-col gap-10 p-20">
      <Link href={"/blogs"}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>New Blog</h6>
        </div>
      </Link>
      <form
        action={formAction}
        onSubmit={(e) => {
          if (!window.confirm("Are you sure you want to add this project?")) {
            e.preventDefault(); // Stops the form from submitting
            toast.dismiss("loading-toast");
            return;
          }

          //reset the editor
          // const editor = quillRef.current?.getEditor();
          // editor?.setText("");

          setContent("");
        }}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="title-input">Title:</label>
          <input
            required
            type="text"
            id="title-input"
            name="title"
            maxLength={50}
          />
        </div>
        <div className="gap-1 hidden">
          <label htmlFor="context-input">Context:</label>
          <input
            type="text"
            id="context-input"
            name="context"
            defaultValue={content}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="excerpt-input">Summary/Excerpt:</label>
          <input required type="text" id="excerpt-input" name="excerpt" />
        </div>

        <div>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            className="[&_.ql-container]:min-h-100" //directly overwriting quill container class
          />
        </div>

        <div className="flex flex-row justify-end">
          <PrimaryButton
            type="submit"
            label="Post blog"
            onClick={() => {
              toast.loading("Loading…", {
                id: "loading-toast",
                className: "!bg-gray-100 !border-2 !border-gray-300",
              });
            }}
          />
        </div>
      </form>
    </div>
  );
}
