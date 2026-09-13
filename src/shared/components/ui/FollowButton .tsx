"use client";

import Select, { SingleValue } from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/features/account/store/authStore";
import { useState } from "react";

type Page = {
  id: string;
  isFollowing: boolean;
  followTypeId?: number;
};

type FollowTypeOption = {
  value: number;
  label: string;
};
const pageTypeOptions = [
  { value: 0, label: "📅 Daily" },
  { value: 1, label: "📅 Daily+" },
  { value: 2, label: "🗓️ Weekly" },
  { value: 3, label: "🗓️ Weekly+" },
  { value: 4, label: "🗓️ BiWeekly" },
  { value: 5, label: "🗓️ BiWeekly+" },
  { value: 6, label: "📊 Monthly" },
  { value: 7, label: "📊 Monthly+" },
  { value: 8, label: "🏆 Yearly" },
  { value: 9, label: "🏆 Yearly+" },
];
type Props = {
  page: Page;
};

const FollowButton = ({ page }: Props) => {
  const [isFollowing, setIsFollowing] = useState(page.isFollowing);
  const [selectedType, setSelectedType] = useState<FollowTypeOption | null>(
    page.followTypeId
      ? pageTypeOptions.find((x) => x.value === page.followTypeId) || null
      : null,
  );

  const handleChange = async (val: SingleValue<FollowTypeOption>) => {
    if (!val) return;

    setSelectedType(val);
    setIsFollowing(true);

    const token = useAuthStore.getState().accessToken;
    if (!token) {
      console.error("No access token found");
      return;
    }

    await fetch(`http://localhost:7120/api/pages/${page.id}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pageTypeId: val.value }),
      credentials: "include",
    });
  };

  const handleUnfollow = async () => {
    setIsFollowing(false);
    setSelectedType(null);

    const token = useAuthStore.getState().accessToken;
    await fetch(`http://localhost:7120/api/pages/${page.id}/follow`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  };
  return (
    <div style={{ minWidth: 140 }}>
      <AnimatePresence mode="wait">
        {!isFollowing ? (
          <motion.div
            key="follow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            <Select
              options={pageTypeOptions}
              placeholder="Follow"
              value={selectedType}
              onChange={handleChange}
              isSearchable={false}
              menuPortalTarget={
                typeof window !== "undefined" ? document.body : null
              }
              menuPosition="fixed"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: "30px",
                  height: "30px",
                  borderRadius: "16px",
                  fontSize: "13px",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #6366f1, #3b82f6)",
                  border: "none",
                  boxShadow: "0 2px 6px rgba(99,102,241,0.25)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }),

                valueContainer: (base) => ({
                  ...base,
                  padding: "0 8px",
                  justifyContent: "center",
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: 500,
                  fontSize: "13px",
                  textAlign: "center",
                  width: "100%",
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: 500,
                  fontSize: "13px",
                  textAlign: "center",
                  width: "100%",
                }),

                dropdownIndicator: (base) => ({
                  ...base,
                  color: "white",
                  padding: "0 4px",
                }),

                indicatorsContainer: (base) => ({
                  ...base,
                  position: "absolute",
                  right: 4,
                }),

                indicatorSeparator: () => ({
                  display: "none",
                }),
              }}
            />
          </motion.div>
        ) : (
          <motion.button
            key="following"
            onClick={handleUnfollow}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{
              y: -2,
              backgroundColor: "#fee2e2",
              color: "#dc2626",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              height: "34px",
              borderRadius: "20px",
              padding: "0 14px",
              fontSize: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              background: "#e6f4ea",
              color: "#16a34a",
            }}
          >
            ✓ {selectedType?.label || "Following"}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FollowButton;
