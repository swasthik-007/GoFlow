import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import AIInputBox from "@/components/custom/AIInputBox";
import Header from "@/app/components/Header";
import Sidebar from "@/components/sidebars";

function createNew() {
  return (
    // <div className="p-10 md:px-28 lg:px-64 xl:px-72 mt-20">
    //          <div className="h-[10%]">
    //                <Header />
    //              </div>

    //    <div className="flex flex-col items-center">
    //     <h2 className="font-bold text-3xl text-primary">
    //       CREATE NEW EMAIL TEMPLATE
    //     </h2>
    //     <p className="text-lg text-gray-400">
    //       Effortlsessly Design and Customize professional AI powered email
    //       templates
    //     </p>
    //     <Tabs defaultValue="AI" className="w-[500px] mt-10 ">
    //       <TabsList>
    //         <TabsTrigger value="AI">
    //           Create With AI <Sparkles className="h-5 w-3 ml-2" />{" "}
    //         </TabsTrigger>
    //         <TabsTrigger value="SCRATCH">Start from Scratch </TabsTrigger>
    //       </TabsList>
    //       <TabsContent value="AI">
    //         {" "}
    //         <AIInputBox />{" "}
    //       </TabsContent>
    //       <TabsContent value="SCRATCH">Change your password here.</TabsContent>
    //     </Tabs>
    //   </div>
    // </div>
    <div className="h-screen flex w-full overflow-hidden">
      <div className="w-[13.4%] ">
        <Sidebar />
      </div>
      <div className="h-full w-[88%]  flex flex-col ">
        <div className="h-[10%]">
          <Header />
        </div>
        <div className="flex flex-col items-center h-screen mt-34 ">
          <h2 className="font-bold text-3xl text-primary">
            CREATE NEW EMAIL TEMPLATE
          </h2>
          <p className="text-lg text-gray-400">
            Effortlsessly Design and Customize professional AI powered email
            templates
          </p>
          <Tabs defaultValue="AI" className="w-[500px] mt-10 ">
            <TabsList>
              <TabsTrigger value="AI">
                Create With AI <Sparkles className="h-5 w-3 ml-2" />{" "}
              </TabsTrigger>
              {/* <TabsTrigger value="SCRATCH">Start from Scratch </TabsTrigger> */}
            </TabsList>
            <TabsContent value="AI">
              {" "}
              <AIInputBox />{" "}
            </TabsContent>
            <TabsContent value="SCRATCH">
              Change your password here.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default createNew;