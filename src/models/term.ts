interface TermInterface {
  id?: number
  name?: string
  start_date?: string
  end_date?: string
}

export class Term {
  public id: number
  public name: string
  public start_date: string
  public end_date: string

  public constructor ({ id = null, name = null, start_date = null, end_date = null }: TermInterface) {
    Object.assign(this, { id, name, start_date, end_date })
  }
}
