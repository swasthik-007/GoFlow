// import Sidebar from "@/components/sidebars.tsx";
// import React from "react";
// // import Sidebar from '../components/sidebar.tsx'
// function mailLayout({ children }) {
//   return (
//     <div>
//       <div className="md:w-60 hidden md:block">
//         <Sidebar />
//       </div>
//       <div className="ml-12 p-1 ">{children}</div>
//     </div>
//   );
// }

// export default mailLayout;

import Sidebar from "@/components/sidebars.tsx";
import React from "react";

function MailLayout({ children }) {
  return (
    <div className="">
      {/* Sidebar - Fixed Width */}
      {/* <div className=" md:block md:w-64">
        <Sidebar />
      </div> */}

      {/* Main Content - Takes Full Width */}
      <div>{children}</div>
    </div>
  );
}

export default MailLayout;