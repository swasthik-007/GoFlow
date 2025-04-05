"use client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { ScreenSizeContext } from "@/context/ScreenSizeContext";
import { DragDropLayoutElement } from "@/context/DragDropLayoutElement";
import { EmailTemplateContext } from "@/context/EmailTemplateContext";
import { SelectedElementContext } from "@/context/SelectedElementContext";

interface ProviderProps {
  children: ReactNode;
}

function Provider({ children }: ProviderProps) {
  const [screenSize, setScreenSize] = useState("desktop");
  const [dragElementLayout, setDragElementLayout] = useState();
  const [emailTemplate, setEmailTemplate] = useState([]);
  const [selectedElement, setSelectedElement] = useState();

  useEffect(() => {
    if (typeof window !== undefined) {
      try {
        const storage = localStorage.getItem("userDetail");
        const emailTemplateStorage = localStorage.getItem("emailTemplate");

        // Parse only if the value exists
        const parsedUserDetail = storage ? JSON.parse(storage) : {};
        const parsedEmailTemplate = emailTemplateStorage
          ? JSON.parse(emailTemplateStorage)
          : [];

        setEmailTemplate(parsedEmailTemplate);
        // if (!parsedUserDetail?.email) {
        //   // Handle case where userDetail is invalid
        // } else {
        //   setUserDetail(parsedUserDetail);
        // }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        setEmailTemplate([]); // Reset to default value if parsing fails
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      localStorage.setItem("emailTemplate", JSON.stringify(emailTemplate));
    }
  }, [emailTemplate]);

  useEffect(() => {
    if (selectedElement) {
      let updatedEmailTemplates = [];
      emailTemplate.forEach((item, index) => {
        if (item?.id === selectedElement?.layout?.id) {
          updatedEmailTemplates?.push(selectedElement?.layout);
        } else {
          updatedEmailTemplates.push(item);
        }
      });

      setEmailTemplate(updatedEmailTemplates);
    }
  }, [selectedElement]);

  return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        
          <ScreenSizeContext.Provider value={{ screenSize, setScreenSize }}>
            <DragDropLayoutElement.Provider
              value={{ dragElementLayout, setDragElementLayout }}>
              <EmailTemplateContext.Provider
                value={{ emailTemplate, setEmailTemplate }}>
                <SelectedElementContext.Provider
                  value={{ selectedElement, setSelectedElement }}>
                  <div>{children}</div>
                </SelectedElementContext.Provider>
              </EmailTemplateContext.Provider>
            </DragDropLayoutElement.Provider>
          </ScreenSizeContext.Provider>
      </GoogleOAuthProvider>
  );
}

export default Provider;


export const useScreenSize = () => {
  return useContext(ScreenSizeContext);
};

export const useDragElementLayout = () => {
  return useContext(DragDropLayoutElement);
};

export const useEmailTemplate = () => {
  return useContext(EmailTemplateContext);
};

export const useSelectedElement = () => {
  return useContext(SelectedElementContext);
};
