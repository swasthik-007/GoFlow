import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Copy } from "lucide-react";

function ViewHtmlDialog({
  openDialog,
  setOpenDialog,
  htmlCode,
}: {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  htmlCode: string | null;
}) {
  const CopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex items-center justify-between">
              <h2>HTML Email Template</h2>
              <Copy
                className="p-2 bg-gray-100  rounded-full h-8 w-8 cursor-pointer mr-4"
                onClick={CopyCode}
              />
            </div>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className="p-4 rounded-md text-sm overflow-auto max-h-96  bg-black text-white">
            <pre className="whitespace-pre-wrap break-all">
              {htmlCode ? htmlCode : "No HTML generated yet."}
            </pre>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

export default ViewHtmlDialog;
