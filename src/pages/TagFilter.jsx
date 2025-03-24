import React from 'react';
import { Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const tags = ['react', 'nodejs', 'mongodb', 'flutter'];

const TagFilter = () => {
  const navigate = useNavigate();

  const handleTagClick = (tag) => {
    navigate(`/?tag=${tag}`); 
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {tags.map((tag) => (
        <Tag
          key={tag}
          color="blue"
          onClick={() => handleTagClick(tag)}
          style={{ cursor: 'pointer' }}
        >
          #{tag}
        </Tag>
      ))}
    </div>
  );
};

export default TagFilter;
