import React, { useRef } from "react";
import { Box, Label, Input, Button, Flex, Checkbox } from "theme-ui";
import { useHistory } from "react-router-dom";
import shortid from "shortid";

import { useAuth } from "../contexts/AuthContext";

import useSetting from "../hooks/useSetting";

import Modal from "../components/Modal";

function StartModal({ isOpen, onRequestClose }) {
  let history = useHistory();
  const { password, setPassword } = useAuth();

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  const [usePassword, setUsePassword] = useSetting("game.usePassword");
  function handleUsePasswordChange(event) {
    setUsePassword(event.target.checked);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!usePassword) {
      setPassword("");
    }
    history.push(`/game/${shortid.generate()}`);
  }

  const inputRef = useRef();
  function focusInput() {
    inputRef.current && inputRef.current.focus();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      onAfterOpen={focusInput}
    >
      <Flex
        sx={{
          flexDirection: "column",
          justifyContent: "center",
          maxWidth: "300px",
          flexGrow: 1,
        }}
        m={2}
      >
        <Box as="form" onSubmit={handleSubmit}>
          <Label htmlFor="password">Game Password</Label>
          <Input
            my={1}
            id="password"
            name="password"
            value={usePassword ? password : ""}
            onChange={handlePasswordChange}
            disabled={!usePassword}
            autoComplete="off"
            ref={inputRef}
          />
          <Box>
            <Label mb={3}>
              <Checkbox
                checked={usePassword}
                onChange={handleUsePasswordChange}
              />
              Use password
            </Label>
          </Box>
          <Flex>
            <Button sx={{ flexGrow: 1 }} disabled={!password && usePassword}>
              Start
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Modal>
  );
}

export default StartModal;
