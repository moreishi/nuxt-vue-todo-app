export type Task  = {
    id: number
    label: string,
    status: {
        done: boolean
    }
}