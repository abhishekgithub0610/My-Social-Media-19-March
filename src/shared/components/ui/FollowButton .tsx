"use client";

import Select, { SingleValue } from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/features/account/store/authStore";
import { useState } from "react";

type Page = {
  id: string; // 👈 IMPORTANT
  isFollowing: boolean;
  followTypeId?: number; // ✅ ADD THIS
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
  // const FollowButton = ({ page }: { page: Page }) => {

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
        Authorization: `Bearer ${token}`, // ✅ ADDED
      },
      body: JSON.stringify({ pageTypeId: val.value }),
      credentials: "include", // ✅ if using cookies
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
      credentials: "include", // ✅ if you are using cookies too
    });
  };

  //pending: fetch selected type on mount if already following
  // useEffect(() => {
  //   if (page.isFollowing) {
  //     // optional: fetch selected type from API later
  //   }
  // }, [page]);
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
                  minHeight: "30px", // 👈 reduce height
                  height: "30px",
                  borderRadius: "16px",
                  fontSize: "13px", // 👈 increase text size
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
                  padding: "0 8px", // 👈 better spacing
                  justifyContent: "center",
                }),

                placeholder: (base) => ({
                  ...base,
                  color: "white",
                  fontWeight: 500,
                  fontSize: "13px", // 👈 match control
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
                  padding: "0 4px", // 👈 tighter arrow spacing
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

// // "use client";

// // import { useState } from "react";
// // import Select from "react-select";
// // import { Button } from "react-bootstrap";

// // const pageTypeOptions = [
// //   { value: 0, label: "Daily" },
// //   { value: 1, label: "Daily+" },
// //   { value: 2, label: "Weekly" },
// //   { value: 3, label: "Weekly+" },
// //   { value: 4, label: "BiWeekly" },
// //   { value: 5, label: "BiWeekly+" },
// //   { value: 6, label: "Monthly" },
// //   { value: 7, label: "Monthly+" },
// //   { value: 8, label: "Yearly" },
// //   { value: 9, label: "Yearly+" },
// // ];

// // const FollowButton = ({ page }: { page: any }) => {
// //   const [isFollowing, setIsFollowing] = useState(page.isFollowing);
// //   const [selectedType, setSelectedType] = useState<number | null>(null);

// //   const handleFollow = () => {
// //     if (selectedType === null) {
// //       alert("Select a type");
// //       return;
// //     }

// //     console.log("Follow with type:", selectedType);
// //     setIsFollowing(true);
// //   };

// //   const handleUnfollow = () => {
// //     setIsFollowing(false);
// //     setSelectedType(null);
// //   };

// //   return (
// //     <div style={{ minWidth: 220 }}>
// //       {!isFollowing ? (
// //         <div className="d-flex align-items-center gap-2">
// //           {/* DROPDOWN */}
// //           <div style={{ flex: 1 }}>
// //             <Select
// //               options={pageTypeOptions}
// //               placeholder="Type"
// //               classNamePrefix="select"
// //               onChange={(val: any) => setSelectedType(val?.value ?? null)}
// //               styles={{
// //                 control: (base, state) => ({
// //                   ...base,
// //                   minHeight: "34px",
// //                   height: "34px",
// //                   fontSize: "12px",
// //                   borderRadius: "20px",
// //                   backgroundColor: "#f9fafb", // 🔥 soft background
// //                   border: "1px solid #e5e7eb",
// //                   boxShadow: state.isFocused
// //                     ? "0 0 0 2px rgba(99,102,241,0.25)"
// //                     : "none",
// //                   transition: "all 0.2s ease",
// //                   "&:hover": {
// //                     borderColor: "#6366f1",
// //                     backgroundColor: "#ffffff",
// //                   },
// //                 }),

// //                 valueContainer: (base) => ({
// //                   ...base,
// //                   padding: "0 10px",
// //                 }),

// //                 placeholder: (base) => ({
// //                   ...base,
// //                   color: "#9ca3af", // subtle gray
// //                 }),

// //                 singleValue: (base) => ({
// //                   ...base,
// //                   fontWeight: 500,
// //                   color: "#111827",
// //                 }),

// //                 indicatorsContainer: (base) => ({
// //                   ...base,
// //                   height: "34px",
// //                 }),

// //                 dropdownIndicator: (base, state) => ({
// //                   ...base,
// //                   color: state.isFocused ? "#6366f1" : "#9ca3af",
// //                   transition: "color 0.2s",
// //                   "&:hover": {
// //                     color: "#6366f1",
// //                   },
// //                 }),

// //                 menu: (base) => ({
// //                   ...base,
// //                   borderRadius: "12px",
// //                   overflow: "hidden",
// //                   boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
// //                   border: "1px solid #eee",
// //                 }),

// //                 option: (base, state) => ({
// //                   ...base,
// //                   fontSize: "13px",
// //                   padding: "8px 12px",
// //                   backgroundColor: state.isSelected
// //                     ? "#6366f1"
// //                     : state.isFocused
// //                       ? "#eef2ff"
// //                       : "white",
// //                   color: state.isSelected ? "white" : "#111827",
// //                   cursor: "pointer",
// //                 }),
// //               }}
// //             />
// //           </div>

// //           {/* FOLLOW BUTTON */}
// //           <Button
// //             size="sm"
// //             onClick={handleFollow}
// //             className="fw-semibold border-0"
// //             style={{
// //               fontSize: "12px",
// //               height: "34px",
// //               padding: "0 14px",
// //               borderRadius: "20px",
// //               background: "linear-gradient(135deg, #6366f1, #3b82f6)",
// //               boxShadow: "0 3px 10px rgba(99,102,241,0.3)",
// //               transition: "all 0.2s ease",
// //               whiteSpace: "nowrap",
// //             }}
// //             onMouseEnter={(e) => {
// //               e.currentTarget.style.transform = "translateY(-1px)";
// //               e.currentTarget.style.boxShadow =
// //                 "0 5px 14px rgba(99,102,241,0.4)";
// //             }}
// //             onMouseLeave={(e) => {
// //               e.currentTarget.style.transform = "translateY(0)";
// //               e.currentTarget.style.boxShadow =
// //                 "0 3px 10px rgba(99,102,241,0.3)";
// //             }}
// //           >
// //             Follow
// //           </Button>
// //         </div>
// //       ) : (
// //         <Button
// //           size="sm"
// //           onClick={handleUnfollow}
// //           className="fw-semibold border-0"
// //           style={{
// //             fontSize: "12px",
// //             height: "34px",
// //             padding: "0 14px",
// //             borderRadius: "20px",
// //             background: "#e6f4ea",
// //             color: "#16a34a",
// //             transition: "all 0.2s ease",
// //           }}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.background = "#fee2e2";
// //             e.currentTarget.style.color = "#dc2626";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.background = "#e6f4ea";
// //             e.currentTarget.style.color = "#16a34a";
// //           }}
// //         >
// //           Following
// //         </Button>
// //       )}
// //     </div>
// //   );
// // };

// // export default FollowButton;

// "use client";

// import { useState } from "react";
// import Select from "react-select";
// import { Button } from "react-bootstrap";

// const FollowButton = ({ page }: { page: any }) => {
//   const [isFollowing, setIsFollowing] = useState(page.isFollowing);
//   const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

//   const options = page.types.map((t: string) => ({
//     label: t,
//     value: t,
//   }));

//   const handleFollow = () => {
//     if (!selectedTypes.length) {
//       alert("Select at least one type");
//       return;
//     }

//     // TODO: API CALL
//     console.log("Follow with types:", selectedTypes);

//     setIsFollowing(true);
//   };

//   const handleUnfollow = () => {
//     // TODO: API CALL
//     setIsFollowing(false);
//     setSelectedTypes([]);
//   };

//   return (
//     <div style={{ minWidth: 200 }}>
//       {!isFollowing ? (
//         <>
//           <Select
//             isMulti
//             options={options}
//             onChange={(val) => setSelectedTypes(val.map((v: any) => v.value))}
//           />

//           <Button className="mt-2 w-100" size="sm" onClick={handleFollow}>
//             Follow
//           </Button>
//         </>
//       ) : (
//         <Button variant="danger" size="sm" onClick={handleUnfollow}>
//           Unfollow
//         </Button>
//       )}
//     </div>
//   );
// };

// export default FollowButton;
