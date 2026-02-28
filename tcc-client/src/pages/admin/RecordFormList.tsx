import { useMemo, useState, useEffect, useRef } from "react";
import type { ComelecRecord } from "../../contexts/comelec-record-context";
import { useTable } from "react-table";
import type { Column, CellProps } from "react-table";
import { useComelecRecords } from "../../contexts/comelec-record-context";
import "./RecordFormList.css";

interface EditableCellProps extends CellProps<ComelecRecord> {
  updateRecord: (
    rowIndex: number,
    columnId: string,
    value: string,
    reason?: string
  ) => Promise<void>;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue ?? "");
  const [reason, setReason] = useState(row.original.inactiveReason ?? "");

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setValue(initialValue ?? "");
    setReason(row.original.inactiveReason ?? "");
  }, [initialValue, row.original.inactiveReason]);

  // Click outside handler to save and close
  useEffect(() => {
    if (!isEditing) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsEditing(false);
        // Save changes
        if (column.id === "status") {
          updateRecord(row.index, column.id, value.toString(), reason);
        } else {
          updateRecord(row.index, column.id, value.toString());
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, value, reason, row.index, column.id, updateRecord]);

  if (!editable) return <span>{value}</span>;

  return (
    <div
      ref={containerRef}
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        column.id === "status" ? (
          <div>
            <select
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              style={{ width: "100%" }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {value === "Inactive" && (
              <input
                type="text"
                placeholder="Reason for inactive"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ marginTop: "4px", width: "100%" }}
              />
            )}
          </div>
        ) : (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            style={{ width: "100%" }}
          />
        )
      ) : (
        <span>
          {value}
          {value === "Inactive" && reason ? ` - ${reason}` : ""}
        </span>
      )}
    </div>
  );
};

export const RecordFormList = () => {
  const { records, updateRecord, deleteRecord } = useComelecRecords();

  const updateCellRecord = async (
    rowIndex: number,
    columnId: string,
    value: string,
    reason?: string
  ) => {
    const row = records[rowIndex];
    if (!row?._id) return;

    const updateObj: Partial<ComelecRecord> = { [columnId]: value };
    if (columnId === "status") {
      updateObj.inactiveReason = value === "Inactive" ? reason ?? "" : "";
    }

    await updateRecord(row._id, updateObj);
  };

  const columns: Array<Column<ComelecRecord>> = useMemo(
    () => [
      { Header: "First Name", accessor: "firstName", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Middle Name", accessor: "middleName", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Last Name", accessor: "lastName", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Birth Date", accessor: "birthDate", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Province", accessor: "provincePlace", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "City / Municipality", accessor: "cityMunicipality", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Precinct Number", accessor: "precintNumber", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Status", accessor: "status", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Suffix", accessor: "suffix", Cell: (props) => <EditableCell {...props} updateRecord={updateCellRecord} editable /> },
      { Header: "Date", accessor: "date", Cell: ({ value }) => <span>{value ? new Date(value).toLocaleDateString() : ""}</span> },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              const confirmed = window.confirm(`Are you sure you want to delete ${row.original.firstName} ${row.original.lastName}?`);
              if (confirmed) deleteRecord(row.original._id ?? "");
            }}
            className="button"
          >
            Delete
          </button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: records });

  return (
    <div className="dashboard-main">
      <div className="table-card">
        <div className="table-container">
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((hg) => (
                <tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((column) => (
                    <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};