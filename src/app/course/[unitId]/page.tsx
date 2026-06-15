import { redirect } from "next/navigation";
import { resolveRegionId } from "@/lib/data/regions";

export default async function CourseRedirect({
  params,
}: {
  params: Promise<{ unitId: string }>;
}) {
  const { unitId } = await params;
  redirect(`/region/${resolveRegionId(unitId)}`);
}
