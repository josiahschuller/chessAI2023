import React from "react";
import { Box, Container, Stack, Select, Button, Text, Heading } from '@chakra-ui/react'


function submit(event, colour, opponent) {
  event.preventDefault();
  window.location.href = `/play/${colour}/${opponent}`;
}


function Form() {
  const [colour, setColour] = React.useState("w");
  const [opponent, setOpponent] = React.useState("random");

  return (
    <Box>
      <form onSubmit={(event) => submit(event, colour, opponent)} noValidate>
        <Stack spacing={4} direction='row' align='center'>
          <Text>I want to play as </Text>
          <Box style={{width: 200}}>
            <Select onChange={(event) => setColour(event.target.value)}>
              <option value="w">White</option>
              <option value="b">Black</option>
            </Select>
          </Box>
        </Stack>
        <Stack spacing={4} direction='row' align='center'>
          <Text>I want to play against </Text>
          <Box style={{width: 200}}>
            <Select onChange={(event) => setOpponent(event.target.value)}>
              <option value="random">Random AI</option>
            </Select>
          </Box>
        </Stack>
        <Button
          type="submit"
          bg="blue.100"
          _hover={{ bg: "blue.200" }}
        >
          Play
        </Button>
      </form>
    </Box>
  )
}

export default function Menu() {
  return (
    <Container>
      <Heading>Menu:</Heading><br/>
      <Form/>
    </Container>
  );
}