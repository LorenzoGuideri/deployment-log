import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Box,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { LogEntry } from "./page";

import { useEffect, useState } from "react";

interface FiltersProps {
  logData: LogEntry[];  // ✅ Added back logData
  setLogData: (data: LogEntry[]) => void;  // ✅ Added back setLogData
  selectedServer: string;
  setSelectedServer: (server: string) => void;
  users: string[];
  selectedUsers: string[];
  setSelectedUsers: (selectedUsers: string[]) => void;
}

export default function Filters({
  logData, 
  setLogData,  
  selectedServer,
  setSelectedServer,
  users,
  selectedUsers,
  setSelectedUsers,
}: FiltersProps) {

    // Maintain state for Server & Author selection to persist after refresh
    const [serverValue, setServerValue] = useState<string>(selectedServer);
    const [authorValue, setAuthorValue] = useState<string[]>(selectedUsers);
  
    useEffect(() => {
      setServerValue(selectedServer);
      setAuthorValue(selectedUsers);
    }, [selectedServer, selectedUsers]);
  
  const handleServerChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    if (newValue !== serverValue) {  // ✅ Prevent unnecessary updates
      setServerValue(newValue);
      setSelectedServer(newValue);

      // ✅ Only update logData if a server is selected
      if (newValue) {
        const filteredLogs = logData.filter((entry) => entry.server === newValue);
        setLogData(filteredLogs);
      }
    }
  };


  const handleUserChange = (event: any) => {
    const newValue = event.target.value;
    if (newValue !== authorValue) {  // ✅ Prevent unnecessary updates
      setAuthorValue(newValue);
      setSelectedUsers(newValue);

      // ✅ Only update logData if at least one user is selected
      if (newValue.length > 0) {
        const filteredLogs = logData.filter((entry) =>
          newValue.includes(entry.author)
        );
        setLogData(filteredLogs);
      }
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{
        padding: "0 !important",
        "& .MuiSelect-select": {
          padding: "0 !important",
          display: "flex",
          alignItems: "center",
          backgroundColor: "white", 
        },
      }}
    >
      {/* Server Dropdown */}
      <FormControl className="mr-2 min-w-[120px]">
      <Select
          value={serverValue}
          onChange={handleServerChange}
          displayEmpty
          className="text-sm p-2 bg-white"
          sx={{
            backgroundColor: "white",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
          }}
        >
          <MenuItem value="" disabled>
            Server
          </MenuItem>
          <MenuItem value="asc" className="text-sm">
            Production
          </MenuItem>
          <MenuItem value="testing" className="text-sm">
            Testing
          </MenuItem>
        </Select>
      </FormControl>
      {/* Author Dropdown (Multi-Select) */}
      <FormControl className="mr-2 min-w-[120px]">
      <Select
          value={authorValue}
          onChange={handleUserChange}
          multiple
          displayEmpty
          className="text-sm p-2 bg-white"
          renderValue={(selected) =>
            selected.length === 0 ? "Author" : selected.join(", ")
          }
          sx={{
            backgroundColor: "white",
            "& .MuiSelect-select": {
              display: "flex",
              marginLeft: "5px",
            },
          }}
        >
          <MenuItem value="" disabled>
            Author
          </MenuItem>
          {users.map((user) => (
            <MenuItem key={user} value={user}>
              <Checkbox checked={selectedUsers.includes(user)} />
              <ListItemText primary={user} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
