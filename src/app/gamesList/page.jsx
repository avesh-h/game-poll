'use client';

import React, { useCallback, useMemo, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';

import Loader from '@/components/Loader/loader';
import ConfirmationModal from '@/components/modal/ConfirmationModal';
import TableMoreMenu from '@/components/Table/TableMoreMenu';
import TableWrapper from '@/components/Table/TableWrapper';
import { Images } from '@/constants/images';
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
  const [confirmationDelete, setConfirmationDelete] = useState({
    open: false,
    data: {},
  });

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
            router.push(`/create-game/${row?._id}`);
            handleCloseMenu();
          },
          getLink: () => {},
          title: 'Edit Game',
          key: 'edit',
        },
        {
          event: async () => {
            //delete game form
            setConfirmationDelete((prevState) => ({
              ...prevState,
              open: true,
              data: {
                title: 'Delete Game',
                image: Images?.deleteIcon?.filename,
                bodyText: 'Are you sure you want to delete this game?',
                submitButtonTitle: 'Confirm',
                cancelButtonTitle: 'Cancel',
                submitButtonColor: 'primary',
                submitButtonVariant: 'contained',
                submitButtonAction: async () => {
                  handleCloseMenu();
                  const res = await deleteGame(row?._id);
                  if (res?.data?.message) {
                    enqueueSnackbar(res?.data?.message, { variant: 'success' });
                  }
                  setConfirmationDelete((prevState) => ({
                    ...prevState,
                    open: false,
                  }));
                },
                cancelButtonAction: () =>
                  setConfirmationDelete((prevState) => ({
                    ...prevState,
                    open: false,
                  })),
              },
            }));
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
        {
          event: () => {
            //navigate to game info page
            router.push(`/gamesList/${row?._id}`);
            handleCloseMenu();
          },
          getLink: () => {},
          title: 'Show Details',
          key: 'showDetails',
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
        sx: { '& .MuiTypography-root': { width: 'max-content' } },
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
        sx: { '& .MuiTypography-root': { width: 'max-content' } },
        render: (row) => {
          return (
            <Typography>{dayjs(row?.startTime)?.format('h:mm A')}</Typography>
          );
        },
      },
      {
        field: 'End',
        headerName: 'end',
        sx: { '& .MuiTypography-root': { width: 'max-content' } },
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
      {isLoading || (isFetching && !games?.games?.length) ? (
        <Loader />
      ) : (
        <TableWrapper
          columns={tableHeaderArray}
          rowsData={games?.games}
          rowKey={'_id'}
          onRowClick={handleRowClick}
        />
      )}
      {!isLoading && !games?.games?.length ? (
        <div
          style={{
            width: 'inherit',
            minHeight: 'calc(100vh - 130px)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <h3>No Game is Booked yet!</h3>
        </div>
      ) : null}
      {/* MORE MENU */}
      <TableMoreMenu
        loader={rowLoader}
        setLoader={setRowLoader}
        open={openMenu}
        onClose={handleCloseMenu}
        actions={moreMenuActions(rowData)}
      />
      <ConfirmationModal
        open={confirmationDelete?.open}
        data={confirmationDelete?.data}
        sx={{ zIndex: 9999 }}
        loading={isDeleting}
      />
    </div>
  );
};

export default GamesList;
