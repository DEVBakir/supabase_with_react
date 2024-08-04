// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(to right, #0033cc, #0066ff)",
  boxShadow: "none",
  transition: "0.3s",
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
}));

const MenuLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "#ffffff",
  margin: theme.spacing(2),
  fontWeight: "bold",
  fontSize: "1.1rem",
  "&:hover": {
    color: "#ffcc00",
    borderBottom: "2px solid #ffcc00",
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="static">
      <StyledToolbar>
        <Typography variant="h6" color="inherit">
          MySite
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <MenuLink to="/products">Products</MenuLink>
          <MenuLink to="/blog">Blog</MenuLink>
          <MenuLink to="/blog/manage">Manage Blog</MenuLink>
        </Box>
        <IconButton
          size="large"
          aria-label="menu"
          color="inherit"
          onClick={handleClick}
          sx={{ display: { xs: "flex", md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              background: "linear-gradient(to right, #0033cc, #0066ff)",
              color: "white",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <MenuLink to="/products">Products</MenuLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <MenuLink to="/blog">Blog</MenuLink>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <MenuLink to="/blog/manage">Manage Blog</MenuLink>
          </MenuItem>
        </Menu>
      </StyledToolbar>
    </StyledAppBar>
  );
};

export default Navbar;
