export interface IEvent<T> {
    id: string
    type: 'chatmessage' | 'connect' | 'disconnect' | 'ban',
    data: T
    timestamp: Date | string
}