import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            console.log('Connected:', socketRef.current?.id);
        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, []);

    return socketRef;
};
