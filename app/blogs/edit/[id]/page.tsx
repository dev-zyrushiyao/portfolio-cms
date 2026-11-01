import { getBlogById } from "@/app/services/blog";
import Link from "next/link";
import React, { Suspense } from "react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import Loading from "./Loading";
import { connection } from "next/server";
import EditBlogForm from "@/app/components/ui/EditBlogForm";

async function BlogDetails({ params }: { params: Promise<{ id: number }> }) {
  //dynamic request-time rendering
  await connection();

  const { id } = await params;
  const blog = await getBlogById(id);

  return <EditBlogForm blog={blog} />;
}

export default function EditBlog({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  return (
    <div className="flex flex-col gap-10 p-20">
      <Link href={"/blogs"}>
        <div className="flex flex-row items-center gap-3">
          <span>
            <MdOutlineArrowBackIosNew />
          </span>
          <h6>Update Blog</h6>
        </div>
      </Link>
      <Suspense fallback={<Loading />}>
        <BlogDetails params={params} />
      </Suspense>
    </div>
  );
}
