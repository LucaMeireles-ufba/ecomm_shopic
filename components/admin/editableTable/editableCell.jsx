"use client"
import { useState } from "react"

export default function EditableCell({ initialValue, setEditedRows, rowIndex, editedRows, setData, cellKey }) {
    const [value, setValue] = useState(initialValue)

    const isAnIdCell = cellKey === 'id';

    const handleInputChange = e => {
        let inputValue = e.target.value

        if (inputValue) {
            if (typeof initialValue === "number") {
                if (Number.isInteger(inputValue)) {
                    inputValue = parseInt(inputValue)
                } else {
                    inputValue = parseFloat(inputValue)
                }
            } else if (typeof initialValue === "boolean") {
                inputValue = inputValue.toLowerCase() === "true"
            }
        }

        setValue(inputValue)
    }

    const handleOnBlur = e => {
        if (value != initialValue) {
            if (!editedRows.includes(rowIndex)) {
                setEditedRows(previousEditedRows => [...previousEditedRows, rowIndex])
            }
        }
        else if (editedRows.length != 0 && editedRows.includes(rowIndex)) {
            setEditedRows(previousEditedRows => previousEditedRows.filter(row => row != rowIndex))
        }

        setData(previousData => previousData.map((row, i) => {
            if (i == rowIndex) {
                row[cellKey] = value
                return row
            }

            return row
        }))
    }

    return (
        <input
            value={value}
            onChange={handleInputChange}
            onBlur={handleOnBlur}
            className={`bg-inherit text-center w-5 ${isAnIdCell && 'cursor-not-allowed'}`}
            style={value !== '' ? { width: String(value).length + 'ch' } : null}
            disabled={isAnIdCell}
        />
    )
}
