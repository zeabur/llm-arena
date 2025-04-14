import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import Battle from "@/app/_components/Battle";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { threadId } = await searchParams;

  if (!threadId || typeof threadId !== 'string') {
    redirect('/?threadId=' + new ObjectId().toHexString());
  }

  return (
    <div className="w-full h-full relative">
      <Battle threadId={threadId} />
    </div>
  );
}
