"use client";
import EmailTemplateList from "@/components/custom/EmailTemplateList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function DashBoard() {

  return (
    <div>
      <div className="p-10 md:px-28 lg:px-40 xl:px-56 mt-16 ">
        <div className="flex justify-between items-center">
          <Link href={"/dashboard/create"}>
            <Button className="">+ Create New Email Template</Button>
          </Link>
        </div>
        <EmailTemplateList/>
      </div>
    </div>
  );
}

export default DashBoard;
