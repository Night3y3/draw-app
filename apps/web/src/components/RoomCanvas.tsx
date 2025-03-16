"use client";

import { useEffect, useState } from "react";
import { Canvas } from "./Canvas";
import useWebSocketStore from "@repo/store/ws"
import { useRouter } from "next/navigation";

export function RoomCanvas({ roomId }: { roomId: string }) {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const router = useRouter()
    const ws = useWebSocketStore(state => state.ws);

    useEffect(() => {
        if (!ws) {
            router.replace("/")
            return;
        }

        ws.onopen = () => {
            setSocket(ws);
            const data = JSON.stringify({
                type: "join_room",
                roomId
            });
            console.log(data);
            ws.send(data)
        }

    }, [roomId])

    if (!socket) {
        return <div>
            Connecting to server....
        </div>
    }

    return <div>
        <Canvas roomId={roomId} socket={socket} />
    </div>
}