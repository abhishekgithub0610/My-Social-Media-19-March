import type { Metadata } from "next";
import AccountSettings from "@/features/account/components/AccountSettings";

export const metadata: Metadata = { title: "Account Settings" };

const Account = () => {
  return <AccountSettings />;
};

export default Account;
