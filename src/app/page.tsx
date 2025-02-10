"use client";
import { Box, CssBaseline, Divider, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Filters from "./Filters";

export interface LogEntry {
  date: string;
  time: string;
  server: string;
  author: string;
  currentHash: string;
  previousHash: string;
  submodule: string;
}

export default function Home() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [logData, setLogData] = useState<LogEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedServer, setSelectedServer] = useState(" ");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateSortOrder, setDateSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState<boolean>(true);
  //a list of all users creaped from the server
  const [users, setUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Scraping function, will fetch the data from -localhost:3000//api/logdata-
  // Load from testing
  const fetchTestLogData = async () => {
    if (!selectedModule) return;
    try {
      setLoading(true);

      const testResponse = await axios.get(
        "https://app.testing.dec-energy.ch/deployment.log",
      );
      const prodResponse = await axios.get(
        "https://app.dec-energy.ch/deployment.log",
      );

      const prodLogData: string = prodResponse.data;
      const testLogData: string = testResponse.data;

      const fullLogData = prodLogData + testLogData;
      const userSet = new Set<string>();

      const parsedData = fullLogData
        .split("\n")
        .map((line) => {
          const regex =
            /(\d{1,2} \w+ \d{4}) (\d{2}:\d{2}:\d{2}) app@(\w+) .*Submodule (\w+) has changed from (\w+) to (\w+) by ([\w\s]+)/;
          const match = line.match(regex);

          //add the user to the list if it is not already there
          if (match) {
            const author = match[7];
            userSet.add(author);
          }

          if (match) {
            const moduleName = match[4].toLowerCase();
            return {
              date: match[1],
              time: match[2],
              server: match[3] === "testing" ? "Testing" : "Production",
              author: match[7],
              currentHash: match[6],
              previousHash: match[5],
              submodule: moduleName,
            };
          }
          return null;
        })
        .filter(Boolean) as LogEntry[];

      setLogData(
        parsedData.filter(
          (entry) => entry.submodule === selectedModule.toLowerCase(),
        ),
      );

      const userList = Array.from(userSet);
      setUsers(userList);
    } catch (error) {
      setError("Error fetching log data");
      console.error("Error fetching log data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedModule = sessionStorage.getItem("selectedModule");
      if (savedModule) {
        setSelectedModule(savedModule);
      } else {
        setSelectedModule("Django");
      }
    }
  }, []);

  useEffect(() => {
    if (selectedModule) {
      fetchTestLogData();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("selectedModule", selectedModule);
      }
    }
  }, [selectedModule]);

  useEffect(() => {
    if (selectedUsers.length === 0) {
      setSelectedUsers(["all users"]);
    } else if (
      selectedUsers.includes("all users") &&
      selectedUsers.length > 1
    ) {
      setSelectedUsers(selectedUsers.filter((user) => user !== "all users"));
    }
  }, [selectedUsers]);

  const filteredLogData = logData.filter(
    (entry) =>
      (selectedServer === " " ||
        entry.server.toLowerCase() === selectedServer) &&
      (selectedUsers.includes("all users") ||
        selectedUsers.includes(entry.author)),
  );

  const sortedLogData = [...filteredLogData]
    .sort((a, b) => {
      if (dateSortOrder === "asc") {
        return (
          new Date(`${a.date} ${a.time}`).getTime() -
          new Date(`${b.date} ${b.time}`).getTime()
        );
      } else {
        return (
          new Date(`${b.date} ${b.time}`).getTime() -
          new Date(`${a.date} ${a.time}`).getTime()
        );
      }
    })
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.author.localeCompare(b.author);
      } else {
        return b.author.localeCompare(a.author);
      }
    });

  const serverMessage = selectedServer
    ? `Dashboard is empty. There are no log entries available for the ${selectedModule} submodule on the ${selectedServer} server.`
    : `Dashboard is empty. There are no log entries available for the ${selectedModule} submodule.`;

  return (
    <Box className="flex">
      <CssBaseline />

      <Sidebar
        selectedModule={selectedModule || "Django"}
        onModuleClick={setSelectedModule}
      />

      <main style={{ flexGrow: 1, padding: "60px", paddingTop: "120px" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" className="text-black font-bold">
            {selectedModule}
          </Typography>

          <Filters
            dateSortOrder={dateSortOrder}
            setDateSortOrder={setDateSortOrder}
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
            logData={logData}
            setLogData={setLogData}
            users={users}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        </Box>

        <Divider className="my-2 border-gray-300" />

        <Dashboard
          logData={sortedLogData}
          loading={loading}
          selectedModule={selectedModule || "Django"}
          serverMessage={serverMessage}
        />
      </main>
    </Box>
  );
}
