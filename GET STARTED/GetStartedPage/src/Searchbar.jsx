import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Search = styled('div')(() => ({
  position: 'relative',
  borderRadius: '30px',
  backgroundColor: alpha('#ffffff', 0.08),
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.12),
  },
  width: 'auto',
  maxWidth: 'none',
  margin: '2rem auto',
  boxShadow: '0 0 20px rgba(138, 43, 226, 0.3)',
  border: '1px solid #c084fc',
  transition: 'all 0.4s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0, // <-- move to right
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#c4b5fd',
  cursor: 'pointer', // <-- pointer on hover
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#ffffff',
  transition: 'all 0.4s ease',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    fontSize: '1rem',
    transition: 'width 0.4s ease',
    width: '20ch',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '50ch',
      },
    },
  },
}));

export default function SearchBar() {
  return (
    <Search>
      <StyledInputBase
        placeholder="Ask a doubt..."
        inputProps={{ 'aria-label': 'search', spellCheck: false }}
      />
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
    </Search>
  );
}
