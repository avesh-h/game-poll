'use client';

import React, { useCallback, useMemo, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

import TableMoreMenu from '@/components/Table/TableMoreMenu';
import TableWrapper from '@/components/Table/TableWrapper';
import {
  useDeleteGameMutation,
  useGetAllGamesQuery,
} from '@/lib/actions/gameActions';

const GamesList = () => {
  const { data: games, isLoading, isFetching } = useGetAllGamesQuery();
  const [deleteGame, { isLoading: isDeleting }] = useDeleteGameMutation();
  const [rowLoader, setRowLoader] = useState('');
  const [openMenu, setOpenMenuActions] = useState(null);
  const [rowData, setRowData] = useState();
  const router = useRouter();

  //Action Button
  const actionButtonIcon = useCallback((row) => {
    return (
      <IconButton
        onClick={(e) => {
          setRowData(row);
          handleOpenMenu(e);
        }}
      >
        <MoreVertIcon width={20} height={20} />
      </IconButton>
    );
  }, []);

  //Actions
  const moreMenuActions = useCallback(
    (row) => {
      let actions = [
        {
          event: () => {
            //Navigate edit game form
            handleCloseMenu();
          },
          getLink: () => {},
          title: 'Edit Game',
          key: 'edit',
        },
        {
          event: async () => {
            //delete game form
            const res = await deleteGame(row?._id);
            if (res?.data?.message) {
              enqueueSnackbar(res?.data?.message, { variant: 'success' });
            }
            handleCloseMenu();
          },
          getLink: () => {},
          title: 'Delete Game',
          key: 'delete',
        },
        {
          event: () => {
            //navigate list api
            router.push(`/games/${row?._id}`);
            handleCloseMenu();
          },
          getLink: () => {},
          title: 'Players List',
          key: 'playersList',
        },
      ];

      return actions;
    },
    [deleteGame, router]
  );

  //Columns
  const tableHeaderArray = useMemo(
    () => [
      {
        field: 'Name',
        headerName: 'name',
        render: (row) => {
          return <Typography>{row?.gameName}</Typography>;
        },
      },
      {
        field: 'Date',
        headerName: 'date',
        render: (row) => {
          return (
            <Typography>
              {dayjs(row?.gameDate)?.format('DD-MM-YYYY')}
            </Typography>
          );
        },
      },
      {
        field: 'Start',
        headerName: 'start',
        render: (row) => {
          return (
            <Typography>{dayjs(row?.startTime)?.format('h:mm A')}</Typography>
          );
        },
      },
      {
        field: 'End',
        headerName: 'end',
        render: (row) => {
          return (
            <Typography>{dayjs(row?.endTime)?.format('h:mm A')}</Typography>
          );
        },
      },
      {
        field: 'Hours',
        headerName: 'hours',
        render: (row) => {
          return <Typography>{row?.totalHours}</Typography>;
        },
      },
      {
        field: 'Amount',
        headerName: 'amount',
        render: (row) => {
          return <Typography>{row?.totalAmount}</Typography>;
        },
      },
      {
        field: 'Venue',
        headerName: 'venue',
        render: (row) => {
          return <Typography>{row?.nameOfVenue}</Typography>;
        },
      },
      {
        field: 'Players',
        headerName: 'players',
        render: (row) => {
          return <Typography>{row?.noOfPlayers}</Typography>;
        },
      },
      {
        field: 'More',
        headerName: 'action',
        sx: { textAlign: 'center', justifyContent: 'center' },
        render: (row) => actionButtonIcon(row),
      },
    ],
    [actionButtonIcon]
  );

  //Row Click
  const handleRowClick = useCallback(
    (row) => {
      router.push(`/games/${row?._id}`);
    },
    [router]
  );

  //More menu
  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    <div>
      {isLoading || isDeleting || (isFetching && !games?.games?.length) ? (
        <>Loading...</>
      ) : (
        <TableWrapper
          columns={tableHeaderArray}
          rowsData={games?.games}
          rowKey={'_id'}
          onRowClick={handleRowClick}
        />
      )}
      {!isLoading && !games?.games?.length ? <>No Game is Booked!</> : null}
      {/* MORE MENU */}
      <TableMoreMenu
        loader={rowLoader}
        setLoader={setRowLoader}
        open={openMenu}
        onClose={handleCloseMenu}
        actions={moreMenuActions(rowData)}
      />
    </div>
  );
};

export default GamesList;
