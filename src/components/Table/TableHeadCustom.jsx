'use client';

import { memo } from 'react';

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {
  Checkbox,
  TableRow,
  TableCell,
  TableHead,
  TableSortLabel,
  Stack,
} from '@mui/material';

const TableHeadCustom = ({
  order,
  orderBy,
  colSpan = 1,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
  t,
}) => {
  return (
    <TableHead sx={sx}>
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel
          ?.filter((data) => !['checkbox'].includes(data?.field))
          .map((headCell, index) => (
            <TableCell
              colSpan={colSpan}
              key={headCell.headerName + index}
              align={headCell.align || 'left'}
              sortDirection={orderBy === headCell.headerName ? order : false}
              sx={{
                width: headCell.width,
                minWidth: headCell.minWidth,
                ...headCell.sx,
              }}
            >
              <Stack
                sx={headCell?.sx}
                direction={'row'}
                alignItems={'center'}
                justifyContent={
                  headCell?.headerName?.includes('action') && 'center'
                }
              >
                {onSort && headCell?.sort ? (
                  <TableSortLabel
                    hideSortIcon
                    direction={orderBy === headCell.headerName ? order : 'asc'}
                    onClick={() => onSort(headCell.headerName)}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {t ? t(headCell.field) : headCell.field}
                  </TableSortLabel>
                ) : t ? (
                  t(headCell.field)
                ) : (
                  headCell.field
                )}
                {onSort && headCell?.sort && (
                  <>
                    <ArrowUpwardIcon
                      sx={{
                        fontSize: 16,
                        color: (theme) =>
                          orderBy === headCell.headerName && order === 'asc'
                            ? theme.palette.grey.darker
                            : theme.palette.grey.main,
                      }}
                    />
                    <ArrowDownwardIcon
                      sx={{
                        color: (theme) =>
                          orderBy === headCell.headerName && order === 'desc'
                            ? theme.palette.grey.darker
                            : theme.palette.grey.main,
                        fontSize: 16,
                        ml: -1,
                        mt: 0.5,
                      }}
                    />
                  </>
                )}
              </Stack>
            </TableCell>
          ))}
      </TableRow>
    </TableHead>
  );
};

export default memo(TableHeadCustom);
