// "use client";
// import { UserButton, useUser } from "@clerk/nextjs";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { ModeToggle } from "./toggle";
// import { useCompose } from "../context/ComposeContext";
// import { cn } from "@/lib/utils";
// import {
//   //   fetchEmails,
//   GenerateLayout,
//   handleRefine,
//   handleSendEmail,
//   initializeTokenAndFetchEmails,
// } from "../helper";
// import fetchEmails from "@/app/mail/page";
// import React, { useEffect } from "react";
// import { redirect } from "next/navigation";
// // import { ComboboxDemo } from "@/components/ui/dropdown";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { ChevronsUpDown, Check } from "lucide-react";

// const options = [
//   { value: "create", label: "Create" },
//   { value: "compose", label: "Compose" },
//   { value: "compose-with-ai", label: "Compose with AI" },
// ];

// // import { Command, CommandInput } from "@/components/ui/command";
// // import fetchEmails from "@/app/mail/page";
// export default function Header() {
//   const { isSignedIn, user } = useUser();
//   const [open, setOpen] = React.useState(false);
//   const [value, setValue] = React.useState("");
//   const {
//     setIsComposeOpen,
//     setComposeWithAi,
//     setIsQuickComposeOpen,
//     isQuickComposeOpen,
//     isComposeOpen,
//     composeWithAi,
//     recipientType,
//     setRecipientType,
//     tone,
//     setTone,
//     purpose,
//     setPurpose,
//     to,
//     setTo,
//     subject,
//     setSubject,
//     body,
//     setBody,
//     isLoading,
//     setIsLoading,
//     token,
//     setToken,
//     setEmails,
//     emails,
//   } = useCompose();

//   const fetchEmailsCallback = () => fetchEmails;

//   useEffect(() => {
//     initializeTokenAndFetchEmails(setToken, fetchEmailsCallback);
//   }, [token]);

//   const handlecreate = () => {
//     redirect("/dashboard/create");
//   };

//   const handleActionSelect = (selectedValue) => {
//     switch (selectedValue) {
//       case "create":
//         handlecreate();
//         break;
//       case "compose":
//         setIsComposeOpen(true);
//         setComposeWithAi(false);
//         break;
//       case "compose-with-ai":
//         setIsQuickComposeOpen(true);
//         setComposeWithAi(true);
//         break;
//       default:
//         break;
//     }
//     setValue(selectedValue);
//     setOpen(false);
//   };

//   return (
//     //   <Popover open={open} onOpenChange={setOpen}>
//     //   <PopoverTrigger asChild>
//     //     <Button
//     //       variant="outline"
//     //       role="combobox"
//     //       aria-expanded={open}
//     //       className="w-[200px] justify-between"
//     //     >
//     //       {value
//     //         ? frameworks.find((framework) => framework.value === value)
//     //             ?.label
//     //         : "Select framework..."}
//     //       <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//     //     </Button>
//     //   </PopoverTrigger>
//     //   <PopoverContent className="w-[200px] p-0">
//     //     <Command>
//     //       <CommandInput placeholder="Search framework..." />
//     //       <CommandList>
//     //         <CommandEmpty>No framework found.</CommandEmpty>
//     //         <CommandGroup>
//     //           {frameworks.map((framework) => (
//     //             <CommandItem
//     //               key={framework.value}
//     //               value={framework.value}
//     //               onSelect={(currentValue) => {
//     //                 setValue(currentValue === value ? "" : currentValue);
//     //                 setOpen(false);
//     //               }}
//     //             >
//     //               <Check
//     //                 className={cn(
//     //                   "mr-2 h-4 w-4",
//     //                   value === framework.value
//     //                     ? "opacity-100"
//     //                     : "opacity-0"
//     //                 )}
//     //               />
//     //               {framework.label}
//     //             </CommandItem>
//     //           ))}
//     //         </CommandGroup>
//     //       </CommandList>
//     //     </Command>
//     //   </PopoverContent>
//     // </Popover>
//     <header
//       suppressHydrationWarning={true}
//       className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700"
//     >
//       {isSignedIn && <SidebarTrigger />}
//       <div className="flex space-x-4">
//         {token && (
//           <Popover open={open} onOpenChange={setOpen}>
//             <PopoverTrigger asChild>
//               <Button
//                 variant="outline"
//                 role="combobox"
//                 aria-expanded={open}
//                 className="w-[200px] justify-between bg-red-500 hover:bg-red-600 text-white"
//               >
//                 {value
//                   ? options.find((option) => option.value === value)?.label
//                   : "Email Actions..."}
//                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-[200px] p-0">
//               <Command>
//                 <CommandInput placeholder="Search actions..." />
//                 <CommandList>
//                   <CommandEmpty>No action found.</CommandEmpty>
//                   <CommandGroup>
//                     {options.map((option) => (
//                       <CommandItem
//                         key={option.value}
//                         value={option.value}
//                         onSelect={(currentValue) => {
//                           handleActionSelect(currentValue);
//                         }}
//                       >
//                         <Check
//                           className={cn(
//                             "mr-2 h-4 w-4",
//                             value === option.value ? "opacity-100" : "opacity-0"
//                           )}
//                         />
//                         {option.label}
//                       </CommandItem>
//                     ))}
//                   </CommandGroup>
//                 </CommandList>
//               </Command>
//             </PopoverContent>
//           </Popover>
//         )}
//       </div>
//       <ModeToggle />
//       <UserButton />
//     </header>
//   );
// }

"use client";
import { UserButton, useUser } from "@clerk/nextjs";
// import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./toggle";
// import { useCompose } from "../context/ComposeContext";
import { cn } from "@/lib/utils";
import {
  GenerateLayout,
  handleRefine,
  handleSendEmail,
  initializeTokenAndFetchEmails,
} from "../helper";
import fetchEmails from "@/app/mail/page";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from redirect to useRouter
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { useCompose } from "@/context/ComposeContext";

const options = [
  { value: "create", label: "Create" },
  { value: "compose", label: "Compose" },
  { value: "compose-with-ai", label: "Compose with AI" },
];

export default function Header() {
  const { isSignedIn, user } = useUser();
  const router = useRouter(); // Use the router hook
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const {
    setIsComposeOpen,
    setComposeWithAi,
    setIsQuickComposeOpen,
    isQuickComposeOpen,
    isComposeOpen,
    composeWithAi,
    recipientType,
    setRecipientType,
    tone,
    setTone,
    purpose,
    setPurpose,
    to,
    setTo,
    subject,
    setSubject,
    body,
    setBody,
    isLoading,
    setIsLoading,
    token,
    setToken,
    setEmails,
    emails,
  } = useCompose();

  const fetchEmailsCallback = () => fetchEmails;

  useEffect(() => {
    initializeTokenAndFetchEmails(setToken, fetchEmailsCallback);
  }, [token]);

  // Modified to use router.push instead of redirect
  const handlecreate = () => {
    router.push("/dashboard/create");
  };

  const handleActionSelect = (selectedValue) => {
    switch (selectedValue) {
      case "create":
        handlecreate();
        break;
      case "compose":
        setIsComposeOpen(true);
        setComposeWithAi(false);
        break;
      case "compose-with-ai":
        setIsQuickComposeOpen(true);
        setComposeWithAi(true);
        console.log("Opening compose with AI");
        break;
      default:
        break;
    }
    setValue(selectedValue);
    setOpen(false);
  };

  // Add debug logs to help troubleshoot
  useEffect(() => {
    if (isQuickComposeOpen) {
      console.log("Quick compose is open:", isQuickComposeOpen);
    }
    if (isComposeOpen) {
      console.log("Compose is open:", isComposeOpen);
    }
  }, [isQuickComposeOpen, isComposeOpen]);

  return (
    <header
      suppressHydrationWarning={true}
      className="sticky top-0  flex  p-6 bg-white max-w-full dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700"
    >
      {/* <div className="flex w-1/2 justify-start">
        {isSignedIn && <SidebarTrigger />}
      </div> */}
      <div className="flex w-full space-x-4 items-center">
        <div className="flex w-full justify-between space-x-4">
          {token && (
            <>
              {/* For debugging purposes, add direct buttons */}
              <div className=" h-10 w-40 object-contain">
                <img src="/flow.png" alt="goflow" />
              </div>
              <div className="flex justify-end space-x-4 items-center">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-[200px] justify-between p-6 bg-gradient-to-br from-green-400 to-blue-600 text-white"
                    >
                      {value
                        ? options.find((option) => option.value === value)
                            ?.label
                        : "Email Actions..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search actions..." />
                      <CommandList>
                        <CommandEmpty>No action found.</CommandEmpty>
                        <CommandGroup>
                          {options.map((option) => (
                            <CommandItem
                              key={option.value}
                              value={option.value}
                              onSelect={(currentValue) => {
                                console.log("Selected:", currentValue);
                                handleActionSelect(currentValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  value === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="scale-108">
                  <ModeToggle />
                </div>

                <div className="scale-130 pt-1.5">
                  <UserButton />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick Compose Modal */}
        {isQuickComposeOpen && (
          <div className="fixed inset-0 flex justify-center items-start z-50 backdrop-blur-lg bg-black/30 py-16">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <h2 className="text-lg font-semibold text-gray-800">
                Quick Compose
              </h2>
              <input
                type="text"
                placeholder="Recipient Type (e.g., boss, client, friend)"
                value={recipientType}
                onChange={(e) => setRecipientType(e.target.value)}
                className="w-full p-3 border rounded mt-3"
                required
              />
              <input
                type="text"
                placeholder="Desired Tone (e.g., formal, friendly, apologetic)"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 border rounded mt-3"
                required
              />
              <textarea
                placeholder="Purpose of the email..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-3 border rounded min-h-32 mt-3"
                required
              ></textarea>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsQuickComposeOpen(false)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setIsQuickComposeOpen(false);
                    setIsComposeOpen(true);
                    GenerateLayout({
                      user,
                      recipientType,
                      tone,
                      purpose,
                      setSubject,
                      setBody,
                      setIsLoading,
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Compose Modal */}
        {isComposeOpen && (
          <div className="fixed inset-0 flex justify-center items-start z-50 backdrop-blur-lg bg-black/30 py-16">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <h2 className="text-xl font-medium">Compose New Email</h2>
              <form
                onSubmit={(e) =>
                  handleSendEmail(
                    e,
                    to,
                    subject,
                    body,
                    setTo,
                    setSubject,
                    setBody,
                    setIsLoading,
                    setIsComposeOpen
                  )
                }
                className="space-y-3"
              >
                <input
                  type="email"
                  placeholder="Recipient"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-3 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border rounded mt-3"
                />
                <textarea
                  placeholder="Email Body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 border rounded mt-3"
                />
                {/* Refine Button */}
                {isComposeOpen && !composeWithAi && (
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      await handleRefine(body, setBody, setIsLoading);
                      setIsLoading(false);
                    }}
                    type="button"
                    className="text-white bg-gray-500 hover:bg-gray-600 mt-2 block w-full py-2 rounded"
                  >
                    {isLoading ? "Refining..." : "Refine"}
                  </button>
                )}
                {/* Close Button */}
                <button
                  onClick={() => setIsComposeOpen(false)}
                  type="button"
                  className="text-white bg-red-500 hover:bg-red-600 mt-2 block w-full py-2 rounded"
                >
                  Close
                </button>
                {/* Send Button */}
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full transition"
                >
                  📤 Send Email
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}