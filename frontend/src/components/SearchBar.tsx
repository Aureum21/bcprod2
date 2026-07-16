import { Input, List, VStack, Text } from "@chakra-ui/react";
import React, { useState } from "react";

interface Props {
  words: { name: string; employer_address: string; email: string }[];
  handleChange: (word: string, employer_address: string, email: string) => void;
  searchTerm: string;
}

const SearchBar = ({ words, handleChange, searchTerm }: Props) => {
  return (
    <>
      <Input
        placeholder="Type to search..."
        onChange={(e) =>
          handleChange(e.target.value, e.target.value, e.target.value)
        }
        value={searchTerm}
        mb={4}
      />
      <List.Root variant="plain" width="full">
        <VStack
          width="full"
          alignItems="start"
          overflowY="auto"
          height="200px"
          p={2}
        >
          {words.length > 0 ? (
            words.map((word, index) => (
              <List.Item
                width="full"
                key={index}
                bg="gray.100"
                p={2}
                rounded="md"
                gap={2}
                onClick={() =>
                  handleChange(word.name, word.employer_address, word.email)
                }
              >
                {word.name}
              </List.Item>
            ))
          ) : (
            <Text color="gray.500">No results found.</Text>
          )}
        </VStack>
      </List.Root>
    </>
  );
};

export default SearchBar;
