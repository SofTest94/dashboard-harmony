// TableComponent.tsx
import React, { useState } from 'react';
import StickyHeaderTable from '../molecules/StickyHeaderTable';
import '../styles/components/organisms/TableComponent.css';

interface TableComponentProps {
  headers: string[];
  rows: (string | number)[][];
  onRowClick: (rowData: (string | number)[]) => void; // Agregamos una función de devolución de llamada para manejar el clic en la fila
}

const TableComponent: React.FC<TableComponentProps> = ({ headers, rows, onRowClick }) => {
  const handleRowClick = (rowData: (string | number)[]) => {
    onRowClick(rowData); // Llama a la función de devolución de llamada con los datos de la fila
  };

  // Oculta la primera columna del ID
  const visibleHeaders = headers.slice(1);
  const visibleRows = rows.map((row) => row.slice(1));

  return (
    <div>
      <StickyHeaderTable headers={visibleHeaders} rows={visibleRows} onRowClick={handleRowClick} />
    </div>
  );
};

export default TableComponent;
