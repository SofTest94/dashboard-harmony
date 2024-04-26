import React, { ReactNode, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ReviewsIcon from '@mui/icons-material/Reviews';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';

import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import Avatar from '@mui/material/Avatar';

interface AppTemplateProps {
  children: ReactNode;
}

const AdminTemplate: React.FC<AppTemplateProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    handleMenuClose();
  };

  const handleMenuItemClick = (index: number) => {
    setSelectedIndex(index);
    handleDrawerClose();
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        sx={{
          width: 240, // Ancho del Drawer
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240, // Ancho del Drawer
          },
        }}
      >
        <List>
          {/* Opciones del menú */}
          <ListItem
            button
            component={RouterLink}
            to="/"
            selected={selectedIndex === 0}
            onClick={() => handleMenuItemClick(0)}
          >
            <PersonIcon sx={{ mr: 1 }} color={selectedIndex === 0 ? 'primary' : 'inherit'} />
            <ListItemText primary="Empleados" />
          </ListItem>
          <Divider />

          <ListItem
            button
            component={RouterLink}
            to="/reviews"
            selected={selectedIndex === 1}
            onClick={() => handleMenuItemClick(1)}
          >
            <ReviewsIcon sx={{ mr: 1 }} color={selectedIndex === 1 ? 'primary' : 'inherit'} />
            <ListItemText primary="Reseñas" />
          </ListItem>
          <Divider />

          <ListItem
            button
            component={RouterLink}
            to="/partners"
            selected={selectedIndex === 2}
            onClick={() => handleMenuItemClick(2)}
          >
            <HandshakeIcon sx={{ mr: 1 }} color={selectedIndex === 2 ? 'primary' : 'inherit'} />
            <ListItemText primary="Socios" />
          </ListItem>
          <Divider />

          <ListItem
            button
            component={RouterLink}
            to="/treatments"
            selected={selectedIndex === 3}
            onClick={() => handleMenuItemClick(3)}
          >
            <ManageAccountsIcon sx={{ mr: 1 }} color={selectedIndex === 3 ? 'primary' : 'inherit'} />
            <ListItemText primary="Tratamientos" />
          </ListItem>
          <Divider />

          <ListItem
            button
            component={RouterLink}
            to="/services"
            selected={selectedIndex === 4}
            onClick={() => handleMenuItemClick(4)}
          >
            <SelfImprovementIcon sx={{ mr: 1 }} color={selectedIndex === 4 ? 'primary' : 'inherit'} />
            <ListItemText primary="Servicios" />
          </ListItem>
          <Divider />
        </List>
      </Drawer>
      {/* Contenido principal */}
      <div style={{ marginLeft: open ? 240 : 0, width: '100%', transition: 'margin-left 0.3s ease' }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ backgroundColor: '#00D6B2' }}>
          <Toolbar>
            {/* Menú desplegable */}
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              // style={{ backgroundColor: 'yellow' }}
            >
              <MenuIcon />
            </IconButton>
            {/* Título de la aplicación */}

            {/* <Tooltip title="H A R M O N Y"> */}
            <Typography
              variant="h6"
              component="div"
              sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, color: 'yellow' }}
            >
              H A R M O N Y
              {/* <img
                  src="https://e7.pngegg.com/pngimages/303/436/png-clipart-cabinet-de-physiotherapie-y-physio-logo-physical-therapy-organization-physiotherapist-physiotherapie-logo-text-logo.png" // Aquí coloca la URL de tu imagen de logo
                  alt="Logo"
                  style={{
                    width: 'auto',
                    height: '50px',
                    marginRight: '16px',
                  }}
                /> */}
            </Typography>
            {/* </Tooltip> */}

            {/* Menú de perfil */}
            {/* <Tooltip title="Brandon Baushel Hernandez Granados">
              <IconButton color="inherit" onClick={handleMenuOpen}>
                <Avatar
                  alt="Profile"
                  src="https://fisiomujer.es/wp-content/uploads/2021/07/fisiomujer-Elena-Stratopulos-fisioterapia-mujer.jpg"
                  sx={{ width: 50, height: 50 }} // Ancho y alto personalizados
                />
              </IconButton>
            </Tooltip> */}
          </Toolbar>
        </AppBar>
        {children}
      </div>
      {/* Menú de perfil */}
      <Menu id="profile-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {/* Opción para cerrar sesión */}
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default AdminTemplate;
