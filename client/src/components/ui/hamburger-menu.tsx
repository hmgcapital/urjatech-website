import React, { useState } from "react";
import { motion } from "framer-motion";

interface HamburgerMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  color?: string;
  className?: string;
}

export function HamburgerMenu({ open, setOpen, color = "black", className = "" }: HamburgerMenuProps) {
  // Remove backgroundColor state as it's not needed
  return (
    <div 
      className={`relative w-10 h-10 flex justify-center items-center cursor-pointer ${className}`}
      onClick={() => {
        setOpen(!open);
      }}
      data-hamburger-menu
    >
      <motion.span
        className={`absolute h-[3px] w-8 rounded-md ${open ? 'bg-black' : 'bg-black'}`}
        initial={{ top: "35%" }}
        animate={{ 
          top: open ? "50%" : "35%",
          rotate: open ? 45 : 0,
        }}
        transition={{
          top: { duration: 0.3, ease: "easeOut" },
          rotate: { duration: 0.3, delay: open ? 0.1 : 0, ease: "easeOut" }
        }}
        style={{ backgroundColor: color }}
      />
      <motion.span
        className={`absolute h-[3px] w-8 rounded-md ${open ? 'opacity-0' : 'opacity-1'} bg-black`}
        style={{ top: "50%", backgroundColor: color }}
        transition={{ duration: 0.2 }}
      />
      <motion.span
        className={`absolute h-[3px] w-8 rounded-md ${open ? 'bg-black' : 'bg-black'}`}
        initial={{ top: "65%" }}
        animate={{ 
          top: open ? "50%" : "65%",
          rotate: open ? -45 : 0,
        }}
        transition={{
          top: { duration: 0.3, ease: "easeOut" },
          rotate: { duration: 0.3, delay: open ? 0.1 : 0, ease: "easeOut" }
        }}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}