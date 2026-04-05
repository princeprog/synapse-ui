import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";


const resolveApiBaseUrl = () => {
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!configuredUrl) {
        return 'http://localhost:3001';
    }

    return configuredUrl.endsWith('/') ? configuredUrl.slice(0, -1) : configuredUrl;
}

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);


    useEffect(() => {
        if (!socketRef.current) {
            const apiUrl = resolveApiBaseUrl();
            console.log('🔌 Connecting to WebSocket:', `${apiUrl}/messages`);

            socketRef.current = io(`${apiUrl}/messages`, {
                withCredentials: true,
                autoConnect: true,
                transports: ['websocket', 'polling'], // Try WebSocket first, fallback to polling
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
            })

            socketRef.current.on('connect', () => {
                console.log('✅ WebSocket connected:', socketRef.current?.id)
            })

            socketRef.current.on('disconnect', (reason) => {
                console.log('❌ WebSocket disconnected:', reason);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('🔴 WebSocket connection error:', error.message);
                console.error('🔴 Full error:', error);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [])

    return socketRef.current;
}