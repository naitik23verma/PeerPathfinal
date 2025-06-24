import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  width: '100%',
  maxWidth: '600px',
  margin: '1rem auto',
  boxShadow: '0 4px 15px rgba(138, 43, 226, 0.2)',
  border: '1px solid #c084fc',
  transition: 'all 0.4s ease',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#c4b5fd',
  cursor: 'pointer',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#ffffff',
  width: '100%',
  transition: 'all 0.4s ease',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    width: '100%',
  },
}));

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Search>
      <StyledInputBase
        placeholder="Search for doubts, topics, or keywords..."
        inputProps={{ 'aria-label': 'search', spellCheck: false }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <SearchIconWrapper onClick={handleSearch}>
        <SearchIcon />
      </SearchIconWrapper>
    </Search>
  );
}
