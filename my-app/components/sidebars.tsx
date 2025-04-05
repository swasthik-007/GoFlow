// "use client";
// import { useState } from "react";
// import { Menu, X, Inbox, Send, Trash2, FileText } from "lucide-react";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="fixed z-60 top-0 left-0 h-full bg-gray-900 text-white flex flex-col items-start p-2 transition-all duration-300 ease-in-out"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Sidebar Toggle Button (Only Shows When Collapsed) */}
//       {/* {!isOpen && !isHovered && (
//         <button
//           className="p-3 bg-gray-800 text-white rounded-md m-2"
//           onClick={() => setIsOpen(true)}
//         >
//           <Menu size={24} />
//         </button>
//       )} */}

//       {/* Sidebar Content */}
//       <div
//         className={`w-${
//           isOpen || isHovered ? "64" : "16"
//         } transition-all duration-300 relative`}
//       >
//         {/* Close Button (Only Shows When Expanded) */}
//         {/* {(isOpen || isHovered) && (
//           <button
//             className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
//             onClick={() => setIsOpen(false)}
//           >
//             <X size={24} className="text-white" />
//           </button>
//         )} */}

//         {/* Sidebar Menu Items */}
//         <ul className="mt-6 space-y-4">
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <Inbox size={24} />
//             {(isOpen || isHovered) && <span>Inbox</span>}
//           </li>
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <Send size={24} />
//             {(isOpen || isHovered) && <span>Sent</span>}
//           </li>
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <FileText size={24} />
//             {(isOpen || isHovered) && <span>Drafts</span>}
//           </li>
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <Trash2 size={24} />
//             {(isOpen || isHovered) && <span>Trash</span>}
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
// "use client";
// import { useState } from "react";
// import { Menu, X, Mail, Inbox, ShieldX, Send } from "lucide-react";

// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   return (
//     <div
//       className="fixed z-60 top-0 left-0 h-full bg-gray-900 text-white flex flex-col items-start p-2 transition-all duration-300 ease-in-out"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       {/* Sidebar Toggle Button (Only Shows When Collapsed) */}
//       {!isOpen && !isHovered && (
//         <button
//           className="p-3 bg-gray-800 text-white rounded-md m-2"
//           onClick={() => setIsOpen(true)}
//         >
//           <Menu size={24} />
//         </button>
//       )}

//       {/* Sidebar Content */}
//       <div
//         className={`w-${
//           isOpen || isHovered ? "64" : "16"
//         } transition-all duration-300 relative`}
//       >
//         {/* Close Button (Only Shows When Expanded) */}
//         {(isOpen || isHovered) && (
//           <button
//             className="absolute top-4 right-4 p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition"
//             onClick={() => setIsOpen(false)}
//           >
//             <X size={24} className="text-white" />
//           </button>
//         )}

//         {/* Sidebar Menu Items */}
//         <ul className="mt-6 space-y-4">
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <Mail size={24} />
//             {(isOpen || isHovered) && <span>All Mails</span>}
//           </li>
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <Inbox size={24} />
//             {(isOpen || isHovered) && <span>Inbox</span>}
//           </li>
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <ShieldX size={24} />
//             {(isOpen || isHovered) && <span>Spam</span>}
//           </li>
//           <li className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700">
//             <Send size={24} />
//             {(isOpen || isHovered) && <span>Sent</span>}
//           </li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

"use client";
import { Mail, Inbox, ShieldX, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const menuItems = [
  // { icon: Mail, label: "All Mails", path: "/mail" },
  { icon: Inbox, label: "Inbox", path: "/category/inbox" },
  { icon: Send, label: "Sent", path: "/category/sent" },
  { icon: ShieldX, label: "Spam", path: "/category/spam" },
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col items-start p-4">
      <ul className="mt-6 space-y-6 w-full">
        {menuItems.map(({ icon: Icon, label, path }) => (
          <li
            key={label}
            onClick={() => router.push(path)}
            className="flex items-center w-full gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-700"
          >
            <Icon size={24} />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
