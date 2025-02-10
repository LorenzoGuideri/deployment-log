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

interface FiltersProps {
  dateSortOrder: "asc" | "desc";
  setDateSortOrder: (order: "asc" | "desc") => void;
  selectedServer: string;
  setSelectedServer: (server: string) => void;
  logData: LogEntry[];
  setLogData: (data: LogEntry[]) => void;
  users: string[];
  selectedUsers: string[];
  setSelectedUsers: (selectedUsers: string[]) => void;
}

export default function Filters({
  dateSortOrder,
  setDateSortOrder,
  selectedServer,
  setSelectedServer,
  users,
  selectedUsers,
  setSelectedUsers,
}: FiltersProps) {
  const handleDateSortChange = (event: SelectChangeEvent<string>) => {
    const order = event.target.value === "desc" ? "desc" : "asc";
    setDateSortOrder(order);
  };

  const handleServerChange = (event: SelectChangeEvent<string>) => {
    setSelectedServer(event.target.value);
  };

  const handleUserChange = (event: any) => {
    const value = event.target.value;
    setSelectedUsers(value);
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
        },
      }}
    >
      <FormControl className="mr-2 min-w-[120px]">
        <InputLabel id="date-label" className="text-black" shrink>
          Date
        </InputLabel>
        <Select
          labelId="date-label"
          value={dateSortOrder}
          onChange={handleDateSortChange}
          notched
          label="Date"
          className="text-sm p-2"
          defaultValue="asc"
        >
          <MenuItem value="desc" className="text-sm">
            Newest First
          </MenuItem>
          <MenuItem value="asc" className="text-sm">
            Oldest First
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl className="mr-2 min-w-[120px]">
        <InputLabel id="server-label" className="text-black" shrink>
          Server
        </InputLabel>
        <Select
          labelId="server-label"
          value={selectedServer}
          onChange={handleServerChange}
          notched
          label="Server"
          className="text-sm p-2"
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              marginLeft: "5px",
            },
          }}
        >
          <MenuItem value=" " className="text-sm">
            Select Server
          </MenuItem>
          <MenuItem value="production" className="text-sm">
            Production
          </MenuItem>
          <MenuItem value="testing" className="text-sm">
            Testing
          </MenuItem>
        </Select>
      </FormControl>

      <FormControl className="mr-2 min-w-[120px]">
        <InputLabel id="author-label" className="text-black" shrink>
          Filter by Users
        </InputLabel>
        <Select
          labelId="author-label"
          // Set value to selectedUsers
          value={selectedUsers}
          onChange={handleUserChange}
          multiple
          notched
          label="Filter by Users"
          className="text-sm p-2"
          renderValue={(selected) => {
            return selected.length === 0 ? "All Users" : selected.join(", ");
          }}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              marginLeft: "5px",
            },
          }}
        >
          {users.map((user) => (
            <MenuItem key={user} value={user}>
              <Checkbox checked={selectedUsers.indexOf(user) > -1} />
              <ListItemText primary={user} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
