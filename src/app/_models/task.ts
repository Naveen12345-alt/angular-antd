export class Task {
  id: string
  heading: string
  description: string
  userName: string
  userId: number

  constructor(init?: Partial<Task>) {
    Object.assign(this, init)
  }
}
