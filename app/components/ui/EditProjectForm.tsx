"use client";

import { ProjectProp, TagProp, updateProject } from "@/app/services/project";
import { TechstackProp } from "@/app/services/storage";
import { useRouter } from "next/navigation";
import React, { useActionState } from "react";
import { toast } from "sonner";

interface ProjectFormEdit {
  project: ProjectProp;
  techstack: TechstackProp[];
}

const projectLink: string = "https://zyrushiyao.vercel.app/projects";
export default function EditProjectForm({
  project,
  techstack,
}: ProjectFormEdit) {
  const router = useRouter();

  // useEffect caching issues with state -> stucks at state.success this page is not accessible to the item a user recently update
  // workaround: manually reset the form using <form onSubmit>
  // useEffect(() => {
  //   if (state?.success) {
  //     toast.success(state.message, {
  //       action: {
  //         label: "view",
  //         onClick() {
  //           window.open(projectLink, "_blank");
  //         },
  //       },
  //     });
  //     toast.dismiss("loading-toast");
  //     router.push("/projects");
  //   } else if (state?.success === false) {
  //     toast.error(`${state.message}`);
  //     toast.dismiss("loading-toast");
  //   }
  // }, [state, router]);

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={async (e) => {
        e.preventDefault(); // Stops the form from submitting

        const confirm = window.confirm(
          "Are you sure you want to add this project?",
        );
        if (!confirm) {
          return;
        }

        //Notif loading this.state
        toast.loading("Loading…", {
          id: "loading-toast",
          className: "!bg-gray-100 !border-2 !border-gray-300",
        });

        //init new Form and update new empty formData
        const formData = new FormData(e.currentTarget);
        const result = await updateProject(formData);

        toast.dismiss("loading-toast");

        if (result?.success) {
          toast.success(result.message, {
            action: {
              label: "view",
              onClick() {
                window.open(projectLink, "_blank");
              },
            },
          });
          router.push("/projects");
        } else {
          toast.error(result?.message || "Update failed");
        }
      }}
    >
      <div className="hidden">
        <label htmlFor="title-label" className="text-xl">
          id:
        </label>
        <input
          defaultValue={project.id}
          type="text"
          name="id"
          id="id-label"
          className="border border-gray-300 rounded-sm p-3 text-base"
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="title-label" className="text-xl">
          Title:
        </label>
        <input
          required
          defaultValue={project.title}
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
          required
          defaultValue={project.description_desktop}
          className="h-50 border border-gray-300 rounded-sm p-3 text-base"
          name="description_desktop"
          id="description-desktop-label"
          cols={5}
          rows={5}
          maxLength={500}
        ></textarea>
      </div>
      <div className="flex flex-col">
        <label htmlFor="description-mobile-label" className="text-xl">
          Description - mobile
        </label>

        <textarea
          required
          defaultValue={project.description_mobile}
          className="h-30 border border-gray-300 rounded-sm p-3 text-base"
          name="description_mobile"
          id="description-mobile-label"
          cols={5}
          rows={5}
          maxLength={250}
        ></textarea>
      </div>
      <div className="flex flex-col">
        <fieldset className="border rounded-sm p-5">
          <legend className="text-xl">Techstack</legend>
          <div className="ts-wrapper h-50 flex flex-col flex-wrap">
            {techstack?.map((ts) => {
              //checks the checkbox automatically if project tag exist from the techstack
              const isSelected = project.tags.some(
                (tag) => tag.name === ts.fileName,
              );
              return (
                <div key={ts.originalName} className="flex flex-row gap-2">
                  <input
                    defaultChecked={isSelected}
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
        </fieldset>
      </div>
      <div className="url-file-divider flex lg:flex-row flex-col gap-5">
        <div className="url-wrapper flex flex-col w-full">
          <div className="flex flex-col">
            <label htmlFor="demo-label" className="text-xl">
              Demo URL:
            </label>
            <input
              defaultValue={project.demo_url}
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
              defaultValue={project.documentation_url}
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
              defaultValue={project.prototype_url}
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
              defaultValue={project.github_url}
              type="text"
              name="github_url"
              id="github-label"
              className="border border-gray-300 rounded-sm p-3 text-base"
            />
          </div>
        </div>
        <div className="file-wrapper w-full">
          <div className="lg:h-full h-50 bg-gray-200 flex flex-col justify-center items-center gap-5">
            <label>Project Photo</label>
            <div className="flex flex-col text-center">
              <input
                name="image_url"
                type="file"
                accept="image/png"
                className="file:rounded-xs file:flex file:flex-col file:w-full  file:mr-4 file:py-2 file:px-4 file:border file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>
        </div>
      </div>
      <button type="submit" className="bg-yellow-200 p-5 border rounded-xl">
        Update Project
      </button>
    </form>
  );
}
