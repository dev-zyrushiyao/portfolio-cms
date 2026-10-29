import { Suspense } from "react";
import Loading from "./Loading";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Link from "next/link";
import { getProjectById, ProjectProp } from "@/app/services/project";
import { connection } from "next/server";
import {
  getStorageTechstackImageInfo,
  TechstackProp,
} from "@/app/services/storage";
import EditProjectForm from "@/app/components/ui/EditProjectForm";

//page content
async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  //dynamic request-time rendering
  await connection();

  const { id } = await params;
  const projectData: ProjectProp = await getProjectById(id);
  const techstack: TechstackProp[] = await getStorageTechstackImageInfo();

  return (
    <div>
      <EditProjectForm project={projectData} techstack={techstack} />
    </div>
  );
}

//render the page
export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-20 flex flex-col gap-5">
      <Suspense fallback={<Loading />}>
        <Link href={"/projects"}>
          <div className="flex flex-row items-center gap-3">
            <span>
              <MdOutlineArrowBackIosNew />
            </span>
            <h6>Edit Project:</h6>
          </div>
        </Link>
        <ProjectDetails params={params} />
      </Suspense>
    </div>
  );
}
