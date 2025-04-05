// "use client";

// import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { useRouter } from "next/navigation";

// const items = [
//   { title: "All Mail", url: "/mail", icon: Home },
//   { title: "Inbox", url: "/category/inbox", icon: Inbox },
//   { title: "Sent", url: "/category/sent", icon: Calendar },
//   { title: "Spam", url: "/category/spam", icon: Search },
//   { title: "Settings", url: "/settings", icon: Settings },
// ];

// export function AppSidebar() {
//   const router = useRouter();

//   const handleMenuClick = (url: string) => {
//     router.push(url);
//   };

//   return (
//     <Sidebar>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <button
//                       onClick={() => handleMenuClick(item.url)}
//                       className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
//                       role="button"
//                       tabIndex={0}
//                     >
//                       <item.icon className="w-5 h-5" />
//                       <span>{item.title}</span>
//                     </button>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
//     </Sidebar>
//   );
// }