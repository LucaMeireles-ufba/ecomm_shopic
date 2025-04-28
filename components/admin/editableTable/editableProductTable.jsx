"use client"
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import EditableCell from './editableCell';
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@tremor/react';

export default function EditableProductTable(props) {
    const [data, setData] = useState(props.data);
    const [editedRows, setEditedRows] = useState([]);

    useEffect(() => {
        setData(props.data);
    }, [props.data]);

    const handleRowChange = async (e) => {
        const row = e.target.getAttribute("row");
        const res = await props.action(data[row]); // Call the action passed in props
        if (res === true) {
            toast.success("Operação realizada com sucesso");
        } else {
            toast.error("Erro na operação");
        }
    };

    const handleRemoveRow = async (rowIndex) => {
        const row = data[rowIndex]; // Get the correct row
        if (!row || !row.sku) {
            toast.error("Produto sem SKU válido");
            return;
        }
    
        try {
            const res = await fetch('/api/delete-product-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sku: row.sku }) // Sending SKU here!
            })
    
            const json = await res.json()
    
            if (json.success) {
                toast.success("Produto removido com sucesso")
                setData(prevData => prevData.filter((_, index) => index !== rowIndex))
            } else {
                toast.error(`Erro ao remover produto: ${json.error}`)
            }
        } catch (err) {
            console.error(err)
            toast.error("Erro de conexão")
        }
    }
    

    return (
        <Table className="w-full text-sm text-center text-zinc-600">
            <TableHead className="text-xs uppercase bg-neutral-200 text-zinc-900">
                <TableRow>
                    {props.headers.map((header) => (
                        <th key={header} scope="col" className="px-6 py-3 w-fit">
                            {header}
                        </th>
                    ))}
                    <th scope="col" className="px-6 py-3 w-fit">Remover</th>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="border-b bg-white border-neutral-300">
                        {Object.keys(row).map(key => {
                            const initialValue = [...props.data];
                            return (
                                <TableCell key={key} className="px-6 py-4">
                                    <EditableCell
                                        initialValue={initialValue[rowIndex][key]}
                                        setEditedRows={setEditedRows}
                                        rowIndex={rowIndex}
                                        editedRows={editedRows}
                                        setData={setData}
                                        cellKey={key}
                                    />
                                </TableCell>
                            );
                        })}
                        <TableCell className="px-6 py-4">
                            <Button
                                row={rowIndex}
                                disabled={!(editedRows.includes(rowIndex))}
                                variant="form"
                                onClick={handleRowChange}
                            >
                                <Edit2Icon row={rowIndex} />
                            </Button>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                            <Button
                                variant="danger"
                                onClick={() => handleRemoveRow(rowIndex)}
                            >
                                <Trash2Icon />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}