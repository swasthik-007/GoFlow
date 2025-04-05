"use client";
import {
  useDragElementLayout,
  useEmailTemplate,
  useScreenSize,
} from "@/app/provider";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import ColumnLayout from "./ColumnLayout";
import ViewHtmlDialog from "./ViewHtmlDialog";

const Canvas = forwardRef(
  ({ viewHTMLCode }: { viewHTMLCode: (html: string) => void }, ref) => {
    const htmlRef = useRef<HTMLDivElement>(null);
    const { screenSize } = useScreenSize();
    const { dragElementLayout } = useDragElementLayout();
    const { emailTemplate, setEmailTemplate } = useEmailTemplate() || {
      emailTemplate: [],
      setEmailTemplate: () => {},
    };
    const [dragOver, setDragOver] = useState(false);
    const [htmlCode, setHtmlCode] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Expose the getHTMLContent method to the parent component
    useImperativeHandle(ref, () => ({
      getHTMLContent: () => {
        if (htmlRef.current) {
          const htmlContent = htmlRef.current.innerHTML.trim();
          console.log(htmlContent);
          viewHTMLCode(htmlContent); // Pass the HTML content to the parent
          setHtmlCode(htmlContent);
          setIsDialogOpen(true); // Open the dialog
        }
      },
    }));

    const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(true);
    };

    const onDropHandle = () => {
      setDragOver(false);
      if (dragElementLayout?.dragLayout) {
        setEmailTemplate((prev: any) => [
          ...prev,
          dragElementLayout?.dragLayout,
        ]);
      }
    };

    const getLayoutComponent = (layout: any) => {
      if (layout?.type === "column") {
        return <ColumnLayout layout={layout} />;
      }
      return null;
    };

    return (
      <div className="mt-20 flex flex-col items-center">
        <div
          className={`bg-white p-6 w-full ${
            screenSize === "desktop" ? "max-w-2xl" : "max-w-md"
          } ${dragOver ? "bg-purple-100 p-8" : ""}`}
          onDragOver={onDragOver}
          onDrop={onDropHandle}
          ref={htmlRef}
        >
          {Array.isArray(emailTemplate) && emailTemplate.length > 0 ? (
            emailTemplate.map((layout, index) => (
              <div key={index}>{getLayoutComponent(layout)}</div>
            ))
          ) : (
            <h2 className="p-4 text-center bg-gray-100 border border-dashed">
              Add Layout here
            </h2>
          )}
        </div>

        {/* View HTML Dialog */}
        <ViewHtmlDialog
          openDialog={isDialogOpen}
          setOpenDialog={setIsDialogOpen}
          htmlCode={htmlCode}
        />
      </div>
    );
  }
);

export default Canvas;
