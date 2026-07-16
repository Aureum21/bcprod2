import { List, VStack, Text, Input } from "@chakra-ui/react";
import React, { useState } from "react";
interface Props {
  words: string[];
  handleChange: (term: string) => void;
}

const Search = ({ words, handleChange }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWords = words.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <Input placeholder="Type to search..." value={searchTerm} mb={4} />
      <List.Root variant="plain">
        <VStack
          width="full"
          alignItems="start"
          overflowY="scroll"
          height="200px"
          p={2}
        >
          {filteredWords.length > 0 ? (
            filteredWords.map((word, index) => (
              <List.Item
                width="full"
                key={index}
                bg="gray.100"
                p={2}
                rounded="md"
                gap={2}
                onClick={() => setSearchTerm(word)}
              >
                {word}
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

export default Search;
