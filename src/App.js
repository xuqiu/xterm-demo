import React, { useState } from "react";
import XTerm from "./components/XTerm";
import { Button, Input, InputGroup } from "rsuite";
import "./styles.css";

export default function App() {
  const [wsUrl, setWSUrl] = useState("");
  const [input, setInput] = useState("wss://pty-test.oscollege.net/cli/exec?name=7a79054306915374&container=&bash=sh");

  return (
    <div className="App">
      <h1>Docker attach websocket demo</h1>
      <header>
        <InputGroup>
          <InputGroup.Addon>WebSocket URL</InputGroup.Addon>
          <Input
            placeholder="wss://echo.websocket.org"
            value={input}
            onChange={(value) => setInput(value)}
          />
        </InputGroup>
        <Button appearance="primary" onClick={() => setWSUrl(input)}>
          Connect
        </Button>
      </header>
      <main>{wsUrl && <XTerm key={wsUrl} wsUrl={wsUrl} />}</main>
    </div>
  );
}
