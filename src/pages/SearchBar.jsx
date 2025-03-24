import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/?search=${searchTerm}`); 
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Input
        placeholder="Tìm kiếm bài viết..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Button type="primary" onClick={handleSearch}>
        Tìm kiếm
      </Button>
    </div>
  );
};

export default SearchBar;
