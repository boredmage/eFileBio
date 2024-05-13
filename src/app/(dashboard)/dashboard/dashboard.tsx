import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { Business } from "@prisma/client/edge";
import BusinessCard from "./components/business-card";
import { CreateBusinessModal } from "./components/create-business-modal";

const getBusinesses = async (userId: string) => {
  const res = await prisma.business.findMany({
    where: {
      ownerId: userId,
    },
  });

  return res;
};

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return redirect("/");
  }

  const userBusinesses = await getBusinesses(user.id);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <CreateBusinessModal />
      {userBusinesses.map((business: Business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
};

export default Dashboard;
