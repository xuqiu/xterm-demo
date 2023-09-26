import React, { useEffect, useRef } from "react";
import { Panel } from "rsuite";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import useWebSocket from "react-use-websocket";

export interface XTermProps {
  ws?: WebSocket;
  wsUrl?: string;
  wsRef?: React.MutableRefObject<WebSocket>;
}

function XTerm({
  ws,
  wsUrl,
  wsRef,
  ...props
}: XTermProps & JSX.IntrinsicElements["div"]) {
  const divRef = useRef<HTMLDivElement>();
  const xtermRef = useRef<Terminal>();

  const { readyState, getWebSocket } = useWebSocket(wsUrl);

  const socket = getWebSocket();

  useEffect(() => {
    if (socket) {
      const xterm = (xtermRef.current = new Terminal());
      socket.binaryType = "arraybuffer";
      socket.addEventListener("message", (ev) => {
        const data: ArrayBuffer | string = ev.data;
        if (typeof data === "string") {
          xterm.writeln(data);
        } else {
          xterm.write(new Uint8Array(data));
        }
      });

      xterm.onData((data) => {
        const buffer = new Uint8Array(data.length);
        for (let i = 0; i < data.length; ++i) {
          buffer[i] = data.charCodeAt(i) & 255;
        }
        socket.send(buffer);
      });
      const fitAddon = new FitAddon();
      xterm.loadAddon(fitAddon);

      xterm.open(divRef.current);

      fitAddon.fit();
    }
  }, [socket]);

  const readyStateText = {
    [WebSocket.CONNECTING]: "Connecting",
    [WebSocket.OPEN]: "Open",
    [WebSocket.CLOSING]: "Closing",
    [WebSocket.CLOSED]: "Closed"
  }[readyState];

  return (
    <Panel
      header={
        <>
          {`WebSocket state: ${readyStateText}`}
          <small style={{ float: "right" }}>{wsUrl}</small>
        </>
      }
      bordered
      shaded
      bodyFill
    >
      <div ref={divRef} {...props} />
    </Panel>
  );
}

export default XTerm;
