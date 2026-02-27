import { useMemo, useState, useEffect } from "react";
import type { ComelecRecord } from "../../contexts/comelec-record-context";
import { useTable, Column, CellProps } from "react-table";
import { useComelecRecords } from "../../contexts/comelec-record-context";
import "./RecordFormList.css";

interface EditableCellProps extends CellProps<ComelecRecord> {
  updateRecord: (
    rowIndex: number,
    columnId: string,
    value: string
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

  useEffect(() => {
    setValue(initialValue ?? "");
  }, [initialValue]);

  const onBlur = async () => {
    setIsEditing(false);
    if (value !== initialValue) {
      await updateRecord(row.index, column.id, value.toString());
    }
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          style={{ width: "100%" }}
        />
      ) : (
        <span>{value?.toString()}</span>
      )}
    </div>
  );
};

export const RecordFormList = () => {
  const { records, updateRecord, deleteRecord } = useComelecRecords();

  const updateCellRecord = async (
    rowIndex: number,
    columnId: string,
    value: string
  ) => {
    const row = records[rowIndex];
    if (!row?._id) return;
    await updateRecord(row._id, { [columnId]: value });
  };

  const columns: Array<Column<ComelecRecord>> = useMemo(
    () => [
      {
        Header: "First Name",
        accessor: "firstName",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Middle Name",
        accessor: "middleName",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Last Name",
        accessor: "lastName",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Birth Date",
        accessor: "birthDate",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Province",
        accessor: "provincePlace",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "City / Municipality",
        accessor: "cityMunicipality",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Precinct Number",
        accessor: "precintNumber",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Suffix",
        accessor: "suffix",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => (
          <span>{value ? new Date(value).toLocaleDateString() : ""}</span>
        ),
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              const confirmed = window.confirm(
                `Are you sure you want to delete ${row.original.firstName} ${row.original.lastName}?`
              );
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

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  return (
    <div className="dashboard-main">
      <div className="table-card">
        <div className="table-container">
          <table {...getTableProps()} className="table">
            <thead>
              {headerGroups.map((hg) => (
                <tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((column) => (
                    <th {...column.getHeaderProps()}>
                      {column.render("Header")}
                    </th>
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