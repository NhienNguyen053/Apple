import { useState } from 'react';
import '../../../style.css'
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Cookies from 'js-cookie';
import jwt_decode from 'jwt-decode';
import { useNavigate } from "react-router-dom";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Back to store',
    icon: 'eva:home-fill',
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  let navigate = useNavigate(); 
  const jwtToken = Cookies.get('jwtToken');
  var decodedToken;
  if (jwtToken != null) {
      decodedToken = jwt_decode(jwtToken);
  }
  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const routeChange2 = () => {
    Cookies.remove('jwtToken');
    navigate('/login')
  }

  return (
    <>
      <p>{decodedToken == null ? "" : decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']}</p>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `gray`,
          }),
        }}
      >
      <i className="fa-solid fa-user" style={{ fontSize: '18px' }}></i>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {decodedToken == null ? "" : decodedToken['FirstName'] + " " + decodedToken['LastName']}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {decodedToken == null ? "" : decodedToken['Email']}
          </Typography>
        </Box>
        <Divider sx={{ borderStyle: 'dashed', m: '0!important' }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={routeChange2}
          sx={{ typography: 'body2', color: 'error.main', py: 1 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
