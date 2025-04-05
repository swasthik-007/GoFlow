"use client";

import React from "react";

import Link from "next/link";

function Header() {
  return (
    <div className="flex justify-between items-center p-4 shadow-sm px-10">
      <div>
        <div className="flex gap-3 items-center">
          <Link href={"/dashboard"}></Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
