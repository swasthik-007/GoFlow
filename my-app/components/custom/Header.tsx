"use client";

import Image from "next/image";
import React from "react";

import Link from "next/link";

function Header() {
  // const {userDetail , setUserDetail} = useUserDetail();

  return (
    <div className="flex justify-between items-center p-4 shadow-sm">
      <div>
        {/* {userDetail?.email? */}
        <div className="flex gap-3 items-center">
          <Link href={"/dashboard"}>{/* <Button>DashBoard</Button> */}</Link>
          {/* <Image src={userDetail?.picture} alt='user' width={35} height={35}  className='rounded-full'/> */}
        </div>
        :{/* <SignInButton/> */}
        {/* } */}
      </div>
    </div>
  );
}

export default Header;
