'use client';

import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
} from '@mui/material';

import TableHeadCustom from '../Table/TableHeadCustom';

// const useDisableStyles = makeStyles({
//   disabled: {
//     pointerEvents: 'none !important',
//     cursor: 'not-allowed !important',
//     opacity: '0.5 !important',
//   },
// });

const TableWrapper = ({
  numSelected,
  onSelectAllRows,
  columns,
  rowsData,
  rowKey,
  t,
  order,
  orderBy,
  onSort,
  onRowClick,
  borderBottom,
  borderColor,
}) => {
  const activeColumn = columns?.filter((item) => !item?.hide);

  return (
    <TableContainer sx={{ position: 'relative' }}>
      <Table>
        <TableHeadCustom
          t={t}
          onSelectAllRows={onSelectAllRows}
          headLabel={activeColumn}
          numSelected={numSelected}
          rowCount={rowsData?.length}
          order={order}
          orderBy={orderBy}
          onSort={onSort}
        />
        <TableBody>
          {rowsData?.length &&
            rowsData?.map((row, index) => {
              return (
                <TableRow
                  hover
                  key={row[rowKey]}
                  onClick={(event) => onRowClick && onRowClick(row)}
                  sx={{
                    cursor: 'pointer',
                    borderBottom:
                      borderBottom && index < rowsData?.length - 1
                        ? borderBottom
                        : 0,
                    borderColor: borderColor,
                  }}
                >
                  {activeColumn?.map((column) => {
                    return (
                      <TableCell
                        key={column?.headerName}
                        align={column?.align}
                        sx={column?.sx}
                        onClick={(e) =>
                          column?.headerName?.includes('action') &&
                          e.stopPropagation()
                        }
                      >
                        {column?.render(row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableWrapper;
