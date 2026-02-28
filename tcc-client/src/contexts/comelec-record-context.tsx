import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";

export interface ComelecRecord {
  _id?: string;
  userId: string;
  date: Date;
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  provincePlace: string;
  cityMunicipality: string;
  precintNumber: string;
  status: string;
  inactiveReason?: string; // optional for Inactive
  suffix: string;
}

interface ComelecRecordsContextType {
  records: ComelecRecord[];
  addRecord: (record: ComelecRecord) => Promise<void>;
  updateRecord: (
    id: string,
    newRecord: Partial<ComelecRecord>
  ) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

export const ComelecRecordsContext =
  createContext<ComelecRecordsContextType | undefined>(undefined);

export const ComelecRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<ComelecRecord[]>([]);
  const { user } = useUser();

  // =========================
  // ADD RECORD
  // =========================
  const addRecord = async (record: ComelecRecord) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/comelec-records`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(record),
        }
      );

      if (!response.ok) throw new Error("Failed to add record");

      const newRecord: ComelecRecord = await response.json();
      setRecords((prev: ComelecRecord[]) => [...prev, newRecord]);
    } catch (err) {
      console.error("Error adding record:", err);
    }
  };

  // =========================
  // UPDATE RECORD
  // =========================
  const updateRecord = async (
    id: string,
    newRecord: Partial<ComelecRecord>
  ) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/comelec-records/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newRecord),
        }
      );

      if (!response.ok) throw new Error("Failed to update record");

      const updatedRecord: ComelecRecord = await response.json();

      setRecords((prev: ComelecRecord[]) =>
        prev.map((record: ComelecRecord) =>
          record._id === id ? updatedRecord : record
        )
      );
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  // =========================
  // DELETE RECORD
  // =========================
  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/comelec-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete record");

      setRecords((prev: ComelecRecord[]) =>
        prev.filter((record: ComelecRecord) => record._id !== id)
      );
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  // =========================
  // FETCH USER RECORDS
  // =========================
  const fetchRecords = async () => {
    if (!user) return;

    try {
      console.log(`---user_id${user.id}`)
      const response = await fetch(
        `${import.meta.env.VITE_API_BACKEND_URL}/comelec-records/getAllByUserID/${user.id}`
      );

      if (!response.ok) throw new Error("Failed to fetch records");

      const data: ComelecRecord[] = await response.json();
      setRecords(data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  return (
    <ComelecRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </ComelecRecordsContext.Provider>
  );
};

export const useComelecRecords = (): ComelecRecordsContextType => {
  const context = useContext(ComelecRecordsContext);

  if (!context) {
    throw new Error(
      "useComelecRecords must be used within a ComelecRecordsProvider"
    );
  }

  return context;
};