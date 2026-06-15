import { redirect } from "next/navigation";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  await params;
  redirect("/");
}
