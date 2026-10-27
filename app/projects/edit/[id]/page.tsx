import { Suspense } from "react";
import Loading from "./Loading";

async function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <p>Loaded project ID: {id}</p>;
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-20 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <Suspense fallback={<Loading />}>
        <ProjectDetails params={params} />
      </Suspense>
    </div>
  );
}
