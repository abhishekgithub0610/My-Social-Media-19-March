"use client";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
};

const MobileMenuToggle = ({ open, setOpen }: Props) => {
  return (
    <button
      className="navbar-toggler ms-auto icon-md btn btn-light p-0"
      type="button"
      aria-label="Toggle navigation"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <span className="navbar-toggler-animation">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
};

export default MobileMenuToggle;

// // 'use client'

// // import { useLayoutContext } from '@/context/useLayoutContext'

// // const MobileMenuToggle = () => {
// //   const {
// //     mobileMenu: { open, toggle },
// //   } = useLayoutContext()

// //   return (
// //     <button
// //       className="navbar-toggler ms-auto icon-md btn btn-light p-0"
// //       type="button"
// //       data-bs-toggle="collapse"
// //       aria-label="Toggle navigation"
// //       aria-expanded={open}
// //       onClick={toggle}>
// //       <span className="navbar-toggler-animation">
// //         <span />
// //         <span />
// //         <span />
// //       </span>
// //     </button>
// //   )
// // }

// // export default MobileMenuToggle
