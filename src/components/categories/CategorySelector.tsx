import React, { useState } from 'react';
import { Box, Flex, Button, Icon } from '@chakra-ui/react';
import { FaCheck } from 'react-icons/fa';
import { LuPlus, LuMinus } from 'react-icons/lu';
import { BiDotsVertical } from 'react-icons/bi';
import CategoryPill from './CategoryPill';
import { DataCategory } from './types';

interface CategorySelectorProps {
  categories: DataCategory[];
  onSelect: (selected: DataCategory[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categories, onSelect }) => {
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>([]);

  const handleToggle = (category: DataCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c.id !== category.id));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
  };

  const handleSelect = () => {
    onSelect(selectedCategories);
  };

  return (
    <Box role="group" className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <CategoryPill
          key={category.id}
          category={category}
          isSelected={selectedCategories.includes(category)}
          onToggle={handleToggle}
        />
      ))}
      {selectedCategories.length > 0 && (
        <Flex alignItems="center" gap={2}>
          <Button
            variant="outline"
            onClick={handleClearAll}
            aria-label="Clear All"
            colorScheme="gray"
            size="sm"
          >
            <Icon as={FaCheck} />
            Clear All
          </Button>
          <Button variant="outline" onClick={handleSelect} aria-label="Select" colorScheme="gray" size="sm">
            <Icon as={selectedCategories.length > 0 ? LuMinus : LuPlus} />
          </Button>
          <Button variant="outline" onClick={() => {}} aria-label="Options" colorScheme="gray" size="sm">
            <Icon as={BiDotsVertical} />
          </Button>
        </Flex>
      )}
    </Box>
  );
};

export default CategorySelector;