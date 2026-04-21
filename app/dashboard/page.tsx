import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome, {session.user?.name}!
        </h1>
        <p className="text-gray-500">
          Your email: {session.user?.email}
        </p>
      </div>
    </div>
  );
}