"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "./toggle";
import { cn } from "@/lib/utils";
import {
  GenerateLayout,
  handleRefine,
  handleSendEmail,
  initializeTokenAndFetchEmails,
} from "../helper";
import fetchEmails from "@/app/mail/page";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
import { ChevronsUpDown, Check, X, Send, Edit3, Mail } from "lucide-react";
import { useCompose } from "@/context/ComposeContext";

const options = [
  { value: "create", label: "Create" },
  { value: "compose", label: "Compose" },
  { value: "compose-with-ai", label: "Compose with AI" },
];

export default function Header() {
  const {  user } = useUser();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const quickComposeRef = useRef(null);
  const fullComposeRef = useRef(null);
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
 
  } = useCompose();

  const fetchEmailsCallback = () => fetchEmails;

  useEffect(() => {
    initializeTokenAndFetchEmails(setToken, fetchEmailsCallback);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close Quick Compose modal when clicking outside
      if (
        isQuickComposeOpen &&
        quickComposeRef.current &&
        !quickComposeRef.current.contains(event.target)
      ) {
        setIsQuickComposeOpen(false);
        clearInputs();
      }

      // Close Full Compose modal when clicking outside
      if (
        isComposeOpen &&
        fullComposeRef.current &&
        !fullComposeRef.current.contains(event.target)
      ) {
        setIsComposeOpen(false);
        clearInputs();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isQuickComposeOpen, isComposeOpen]);

  const clearInputs = () => {
    setRecipientType("");
    setTone("");
    setPurpose("");
    setTo("");
    setSubject("");
    setBody("");
  };

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
      className="sticky top-0 z-10 flex items-center w-full py-4 px-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="flex w-full items-center justify-between">
        {token && (
          <>
            <div className="h-10 w-40 object-contain">
              <img src="/flow.png" alt="goflow" className="h-full w-auto" />
            </div>
            <div className="flex items-center space-x-5">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-48 h-10 justify-between bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white border-0 shadow-md transition-all duration-300 font-medium"
                  >
                    {value
                      ? options.find((option) => option.value === value)?.label
                      : "Email Actions"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-80" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-0 border border-gray-200 dark:border-gray-700 shadow-lg rounded-md overflow-hidden">
                  <Command className="border-0">
                    <CommandInput
                      placeholder="Search actions..."
                      className="h-9"
                    />
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
                            className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
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
              <div className="flex items-center space-x-4">
                <ModeToggle />
                <div className="scale-110">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Compose Modal */}
      {isQuickComposeOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm">
          <div
            ref={quickComposeRef}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-xl transform transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-3">
                  <Mail
                    size={24}
                    className="text-blue-600 dark:text-blue-300"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  Quick Compose with AI
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsQuickComposeOpen(false);
                  clearInputs();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* <div className="bg-blue-50 dark:bg-gray-700/40 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Let AI help craft your email. Just provide some details about
                  your recipient, tone, and purpose.
                </p>
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Type
                </label>
                <input
                  type="text"
                  placeholder="Boss, client, friend..."
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tone of Email
                </label>
                <input
                  type="text"
                  placeholder="Formal, friendly, apologetic..."
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Purpose of Email
                </label>
                <textarea
                  placeholder="Describe what you want to say..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-40 resize-none transition-all shadow-sm"
                  required
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => {
                    setIsQuickComposeOpen(false);
                    clearInputs();
                  }}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
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
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-colors flex items-center"
                  disabled={!recipientType || !tone || !purpose}
                >
                  <Mail size={18} className="mr-2" />
                  Generate Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50 bg-black/40 backdrop-blur-sm">
          <div
            ref={fullComposeRef}
            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full mr-3">
                  <Mail
                    size={22}
                    className="text-gr  sas   een-600 dark:text-green-300"
                  />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                  {composeWithAi ? "AI-Generated Email" : "Compose New Email"}
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsComposeOpen(false);
                  clearInputs();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            {/* 
            {composeWithAi && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-5">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  This email was generated with AI based on your specifications.
                  You can edit it before sending or use "Refine with AI" to
                  improve it.
                </p>
              </div>
            )} */}

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
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To
                </label>
                <input
                  type="email"
                  placeholder="recipient@example.com"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                />
              </div>
              <div className="">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Write your message here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-64 resize-none transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={async () => {
                    setIsLoading(true);
                    await handleRefine(body, setBody, setIsLoading);
                    setIsLoading(false);
                  }}
                  type="button"
                  className="flex-1 flex items-center justify-center px-5 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !body.trim()}
                >
                  {isLoading ? (
                    "Refining..."
                  ) : (
                    <>
                      <Edit3 size={18} className="mr-2" />
                      Refine with AI
                    </>
                  )}
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !to || !body.trim()}
                >
                  <Send size={18} className="mr-2" />
                  Send Email
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
