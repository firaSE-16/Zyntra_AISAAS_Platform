import React from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Sidebar from "../sidebar/sidebar";
import { DialogTitle } from "@radix-ui/react-dialog";

const MobileSidebar = () => {
  return(
    
  <Sheet>
    <SheetTrigger>
        
        <Menu className="flex md:hidden"/>
   
    </SheetTrigger>
    <SheetContent side="left" className="p-0">
    <Sidebar/>
    </SheetContent>
    
  </Sheet>
  ) 
  
  
};

export default MobileSidebar;
