import { redirect } from "next/navigation";

const DashboardHome = () => {
  redirect("/dashboard/insights");
};

export default DashboardHome;