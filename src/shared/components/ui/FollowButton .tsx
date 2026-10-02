"use client";

import Select, { SingleValue } from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/features/account/store/authStore";
import { useState } from "react";

type Page = {
  id: string;
  isFollowing: boolean;
  pageType?: number | string | null;
  followTypeId?: number;
  followType?: number | string | null;
};

type FollowTypeOption = {
  value: number;
  label: string;
};
const pageTypeOptions = [
  { value: 0, label: "All" },
  { value: 1, label: "📅 Daily" },
  { value: 2, label: "📅 Daily+" },
  { value: 3, label: "🗓️ Weekly" },
  { value: 4, label: "🗓️ Weekly+" },
  { value: 5, label: "🗓️ Fifteen Days" },
  { value: 6, label: "🗓️ Fifteen Days+" },
  { value: 7, label: "📊 Monthly" },
  { value: 8, label: "📊 Monthly+" },
  { value: 9, label: "🏆 Yearly" },
];

const enumValues: Record<string, number> = {
  all: 0,
  daily: 1,
  dailyplus: 2,
  weekly: 3,
  weeklyplus: 4,
  fifteendays: 5,
  fifteendaysplus: 6,
  monthly: 7,
  monthlyplus: 8,
  yearly: 9,
};

const getEnumValue = (value: number | string | null | undefined) => {
  if (typeof value === "number" && Number.isInteger(value)) return value;
  if (typeof value !== "string") return null;

  const numericValue = Number(value);
  if (value.trim() !== "" && Number.isInteger(numericValue)) {
    return numericValue;
  }

  return enumValues[value.replace(/[^a-z]/gi, "").toLowerCase()] ?? null;
};

const getFollowTypeOption = (
  value: number | string | null | undefined,
  options: FollowTypeOption[],
): FollowTypeOption | null => {
  const enumValue = getEnumValue(value);
  return options.find((option) => option.value === enumValue) || null;
};

type Props = {
  page: Page;
};

const FollowButton = ({ page }: Props) => {
  const pageTypeValue = getEnumValue(page.pageType) ?? 0;
  const availableOptions = pageTypeOptions.filter(
    (option) => option.value >= pageTypeValue,
  );
  const [isFollowing, setIsFollowing] = useState(page.isFollowing);
  const [selectedType, setSelectedType] = useState<FollowTypeOption | null>(
    getFollowTypeOption(page.followType ?? page.followTypeId, availableOptions),
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
      body: JSON.stringify({ pageType: val.value }),
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
              options={availableOptions}
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
