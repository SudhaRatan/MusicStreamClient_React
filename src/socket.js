import { io } from 'socket.io-client'

const URL = import.meta.env.VITE_SERVER

export const socket = io(URL)