"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/features/account/store/authStore";
import { useState } from "react";

type Buddy = {
  id: string; // 👈 IMPORTANT
  isFollowing: boolean;
  followTypeId?: number; // ✅ ADD THIS
};

type Props = {
  buddy: Buddy;
};

const FollowBuddyButton = ({ buddy }: Props) => {
  const [isFollowing, setIsFollowing] = useState(buddy.isFollowing);
  const handleFollow = async () => {
    setIsFollowing(true);

    const token = useAuthStore.getState().accessToken;

    if (!token) {
      console.error("No access token found");
      return;
    }

    await fetch(`http://localhost:7120/api/buddies/${buddy.id}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  };
  const handleUnfollow = async () => {
    setIsFollowing(false);
    //setSelectedType(null);

    const token = useAuthStore.getState().accessToken;
    await fetch(`http://localhost:7120/api/buddies/${buddy.id}/follow`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // ✅ if you are using cookies too
    });
  };

  return (
    <div style={{ minWidth: 140 }}>
      <AnimatePresence mode="wait">
        {!isFollowing ? (
          // ============================================
          // ✅ CHANGED: Replaced Select with simple button
          // ============================================
          <motion.button
            key="follow"
            onClick={handleFollow}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{
              height: "34px",
              borderRadius: "20px",
              padding: "0 14px",
              fontSize: "12px",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
              background: "linear-gradient(135deg, #6366f1, #3b82f6)",
              color: "white",
              boxShadow: "0 2px 6px rgba(99,102,241,0.25)",
            }}
          >
            Follow
          </motion.button>
        ) : (
          // ======================================
          // ✅ UNCHANGED: Following button UI
          // ======================================
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
            ✓ Following
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FollowBuddyButton;
