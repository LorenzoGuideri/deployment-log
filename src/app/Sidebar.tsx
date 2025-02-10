"use client";

import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import Image from "next/image";

interface SidebarProps {
  selectedModule: string;
  onModuleClick: (module: string) => void;
}

const drawerWidth = 240;

export default function Sidebar({
  selectedModule,
  onModuleClick,
}: SidebarProps) {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar className="justify-center">
        <Image
          src="https://dec-energy.ch/safari-pinned-tab.svg"
          alt="DEC Logo"
          width={120}
          height={40}
        />
      </Toolbar>
      <List className="ml-4">
        {["Django", "Website", "Frontend"].map((text) => (
          <ListItem
            component="button"
            key={text}
            onClick={() => onModuleClick(text)}
            className={`space-x-3 rounded-l-lg rounded-r-none ${
              selectedModule === text ? "bg-[#F0F0F0]" : ""
            } hover:bg-[#E0E0E0]`}
          >
            <ListItemIcon className="min-w-0">
              <Box className="w-5 h-5 bg-black" />
            </ListItemIcon>
            <ListItemText primary={text} className="flex justify-start" />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
