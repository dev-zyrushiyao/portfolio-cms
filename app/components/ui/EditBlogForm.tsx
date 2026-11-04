"use client";

import { uploadBlogMediaToStorage } from "@/app/services/storage";
import dynamic from "next/dynamic";
import React, { useActionState, useEffect, useRef, useState } from "react";

import type ReactQuillInstance from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import PrimaryButton from "./PrimaryButton";
import { toast } from "sonner";
import { BlogProp, updateBlog } from "@/app/services/blog";
import { useRouter } from "next/navigation";

// Import Quill dynamically with SSR turned off
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
}) as React.ComponentType<
  React.ComponentProps<typeof ReactQuillInstance> &
    React.RefAttributes<ReactQuillInstance>
>;

interface EditBlogFormProps {
  blog: BlogProp;
}

export default function EditBlogForm({ blog }: EditBlogFormProps) {
  const [content, setContent] = useState<string>(blog.context);
  const quillRef = useRef<ReactQuillInstance | null>(null);
  const [state, formAction] = useActionState(updateBlog, null);
  const blogLink: string = `https://zyrushiyao-portfolio.com/blogs/`;
  const router = useRouter();

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

  return (
    <form
      action={formAction}
      onSubmit={async (e) => {
        if (!window.confirm("Are you sure you want to update this blog?")) {
          e.preventDefault(); // Stops the form from submitting
          toast.dismiss("loading-toast");
          return;
        }

        //init new Form and update new empty formData
        const formData = new FormData(e.currentTarget);
        const result = await updateBlog(null, formData);

        toast.dismiss("loading-toast");

        if (result?.success) {
          toast.success(result.message, {
            action: {
              label: "view",
              onClick() {
                window.open(blogLink, "_blank");
              },
            },
          });
          router.push("/blogs");
        } else {
          toast.error(result?.message || "Update failed");
        }
      }}
      className="flex flex-col gap-5"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="title-input">Title:</label>
        <input
          type="text"
          id="title-input"
          name="title"
          maxLength={50}
          defaultValue={blog.title}
        />
      </div>
      <div className="hidden">
        <label htmlFor="title-input">Blog ID:</label>
        <input type="hidden" id="id-input" name="id" defaultValue={blog.id} />
      </div>
      <div className="hidden">
        <label htmlFor="context-input">Context:</label>
        <input
          type="hidden"
          id="context-input"
          name="context"
          value={content}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="excerpt-input">Summary/Excerpt:</label>
        <input
          type="text"
          id="excerpt-input"
          name="excerpt"
          defaultValue={blog.excerpt}
        />
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
          label="Update blog"
          onClick={() => {
            toast.loading("Loading…", {
              id: "loading-toast",
              className: "!bg-gray-100 !border-2 !border-gray-300",
            });
          }}
        />
      </div>
    </form>
  );
}
