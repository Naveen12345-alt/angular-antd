export class Notification {
  id: number
  name: string

  constructor(init?: Partial<Notification>) {
    Object.assign(this, init)
  }
}
