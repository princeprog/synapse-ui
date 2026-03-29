import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";


const resolveApiBaseUrl = () => {
    const configuredUrl = process.env.REACT_APP_API_BASE_URL;
    if (!configuredUrl) {
        return 'http://localhost:3000';
    }

    return configuredUrl.endsWith('/') ? configuredUrl.slice(0, -1) : configuredUrl;
}

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);


    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io(`${resolveApiBaseUrl()}/messages`, {
                withCredentials: true,
                autoConnect: true,
                transports: ['websocket']
            })

            socketRef.current.on('connect', () => {
                console.log('Websocket connected:', socketRef.current?.id)
            })

            socketRef.current.on('disconnect', (reason) => {
                console.log('❌ WebSocket disconnected:', reason);
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('🔴 WebSocket connection error:', error);
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