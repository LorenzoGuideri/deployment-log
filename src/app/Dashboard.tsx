import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

interface LogEntry {
  date: string;
  time: string;
  server: string;
  author: string;
  currentHash: string;
  previousHash: string;
}

interface DashboardProps {
  logData: LogEntry[];
  loading: boolean;
  selectedModule: string;
  serverMessage: string;
}

export default function Dashboard({
  logData,
  loading,
  selectedModule,
  serverMessage,
}: DashboardProps) {
  if (loading) {
    return (
      <Typography variant="h6" className="text-gray-700 text-center">
        Loading log entries...
      </Typography>
    );
  }

  if (logData.length === 0) {
    return (
      <Typography variant="h6" className="text-gray-700 text-center ">
        {serverMessage}
      </Typography>
    );
  }

  let hashClass = (hash: string) => {
    const color = `#${hash.slice(0, 6)}`;

    const hexToLuminance = (hex: string) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 255;
      const g = (rgb >> 8) & 255;
      const b = rgb & 255;
      //yeah i looked this up and copypasted it here, it just works, idk how
      return 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
    };

    const isTooDark = hexToLuminance(color) < 0.5;

    return {
      backgroundColor: color,
      color: isTooDark ? "#fff" : "#000",
      padding: "2px 6px",
      borderRadius: "4px",
      display: "inline-block",
      marginTop: "5px",
    };
  };
  return (
    <TableContainer >
      <Table className="border-separate  " style={{ borderSpacing: "0 15px" }}>
        <TableHead>
          <TableRow>
            <TableCell className="pb-0 text-[11px]">DATE</TableCell>
            <TableCell className="pb-0 text-[11px]">TIME</TableCell>
            <TableCell className="pb-0 text-[11px]">SERVER</TableCell>
            <TableCell className="pb-0 text-[11px]">AUTHOR</TableCell>
            <TableCell className="pb-0 text-[11px]">CURRENT HASH</TableCell>
            <TableCell className="pb-0 text-[11px]">PREVIOUS HASH</TableCell>
          </TableRow>
        </TableHead>
        <TableBody sx={{ backgroundColor: "#F7F8FA" }}>
          {logData.map((entry, index) => (
            <TableRow key={index}>
              <TableCell className="text-gray-700 rounded-l-[20px] text-md font-medium">
                {entry.date}
              </TableCell>
              <TableCell className="text-gray-700 text-md font-medium">
                {entry.time}
              </TableCell>
              <TableCell className="text-gray-700 text-md font-medium">
                {entry.server}
              </TableCell>
              <TableCell className="text-gray-700 text-md font-medium">
                {entry.author}
              </TableCell>
              <TableCell className="text-gray-700 text-md font-medium">
                <div style={hashClass(entry.currentHash)}>
                  {entry.currentHash.slice(0, 6)}
                </div>
              </TableCell>
              <TableCell className="text-gray-700 text-md rounded-r-[20px] font-medium">
                <div style={hashClass(entry.previousHash)}>
                  {entry.previousHash.slice(0, 6)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
