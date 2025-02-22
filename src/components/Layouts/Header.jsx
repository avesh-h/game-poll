'use client';

import { useMemo, useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useDispatch, useSelector } from 'react-redux';

import { Images } from '@/constants/images';
import { useResponsive } from '@/hooks/useResponsive';
import { useGetProfileDetailsQuery } from '@/lib/actions/profileActions';
import { authActions } from '@/lib/redux/authSlice';
import { isMemberLoggedIn } from '@/lib/utils/editPlayerDetails';

const pages = [
  {
    title: 'Create Game',
    value: 'create-game',
  },
  {
    title: 'Games List',
    value: 'gamesList',
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const session = useSession();
  const isAuth = Cookies.get('accessToken');
  const params = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state?.auth);
  const isSmallScreen = useResponsive('down', 'md');

  const { data, isLoading } = useGetProfileDetailsQuery(
    session?.data?.user?.id,
    {
      skip: !session?.data,
    }
  );

  const settings = useMemo(() => {
    if (session?.data) {
      return ['Profile', 'Logout'];
    }
    return ['Logout'];
  }, [session]);

  const router = useRouter();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  //Page navigation
  const handlePageNavigation = (page) => {
    //Navigation
    router.push(`/${page?.value}`);
    handleCloseNavMenu();
  };

  //Close nav menu in mobile
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleCloseUserMenu = (menu) => {
    if (menu === 'Logout') {
      //logout
      if (session?.data?.user?.id) {
        //session logout for organizer
        signOut();
        //redirect to login
        router.push('/login');
      } else {
        //member logout
        if (isAuth) {
          localStorage.removeItem('session-user');
          Cookies.remove('accessToken');
        }
        //redirect to member login
        router.push(`/members/${params?.['game-id']}`);
      }
      dispatch(authActions.logout());
    } else if (menu === 'Profile') {
      //Redirect to profile page
      router.push('/profile');
    }
    setAnchorElUser(null);
  };

  const headerPages = useMemo(() => {
    if (isLoggedIn) {
      if (isMemberLoggedIn()) {
        return [];
      } else {
        return pages;
      }
    }
    return [];
  }, [isLoggedIn]);

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: '#121212',
        borderBottom: '1px solid rgba(204, 204, 204,0.2)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack
            direction={'row'}
            sx={{
              width: isLoggedIn ? 'auto' : '100%',
              justifyContent: isLoggedIn ? 'normal' : 'space-between',
            }}
          >
            <Stack direction={'row'} alignItems={'center'}>
              <Image
                src={Images?.soccerPlayer?.filename}
                width={45}
                height={40}
                alt={Images?.soccerPlayer?.alt}
                style={{
                  filter: 'invert(90%)',
                  display: isSmallScreen ? 'none' : 'block',
                }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                PLAY-O-TIME
              </Typography>
            </Stack>
            {!isLoggedIn ? (
              <Button
                sx={{
                  color: '#fff',
                }}
                onClick={() => router.push('/login')}
              >
                Sign in
              </Button>
            ) : null}
          </Stack>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {isLoggedIn ? (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {headerPages?.length
                    ? headerPages?.map((page) => (
                        <MenuItem
                          key={page?.value}
                          onClick={() => handlePageNavigation(page)}
                        >
                          <Typography textAlign="center">
                            {page?.title}
                          </Typography>
                        </MenuItem>
                      ))
                    : null}
                </Menu>
              </>
            ) : null}
          </Box>
          {/* Project logo */}
          <Image
            src={Images?.soccerPlayer?.filename}
            width={40}
            height={40}
            alt={Images?.soccerPlayer?.alt}
            style={{
              filter: 'invert(90%)',
              display: isSmallScreen ? 'block' : 'none',
            }}
          />
          {/* Mobile */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 500,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            PLAY-O-TIME
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {headerPages?.length
              ? headerPages?.map((page) => (
                  <Button
                    key={page?.value}
                    onClick={() => handlePageNavigation(page)}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    {page?.title}
                  </Button>
                ))
              : null}
          </Box>
          {isLoggedIn ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={session?.data?.user?.name}
                    src={
                      data?.profileData?.photo || '/static/images/avatar/2.jpg'
                    }
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{
                  'mt': '45px',
                  '& .MuiPaper-root': {
                    boxShadow: '0px 2px 5px 0 #d4d4d4',
                  },
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleCloseUserMenu(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
