export interface Todo {
    _id: string;
    title: string;
    status: TodoStatus;
    priority: number;
}

export enum TodoStatus {
    New = "New",
    InProgress = "InProgress",
    Done = "Done"
}