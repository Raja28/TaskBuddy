
export interface Todo {

    category: string
    createdAt?: string
    description: string
    dueDate: string
    owner: string
    status: string
    title: string
    updatedAt?: string
    _id?: string
}

export interface Task {
    title: string,
    description: string,
    category: string,
    dueDate: string,
    status: string

}
