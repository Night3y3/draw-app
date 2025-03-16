import { create } from "zustand";

interface WebSocketState {
  ws: WebSocket | null;
  setWs: (ws: WebSocket) => void;
  removeWs: () => void;
}

const useWebSocketStore = create<WebSocketState>((set) => ({
  ws: null,
  setWs: (ws: WebSocket) => set({ ws }),
  removeWs: () => set({ ws: null }),
}));

export default useWebSocketStore;
