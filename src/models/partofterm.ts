interface PartOfTermInterface {
  id?: number
  name?: number
  start_date?: string
  end_date?: string
}

export class PartOfTerm {
  public id: number
  public name: number
  public start_date: string
  public end_date: string

  public constructor ({ id = null, name = null, start_date = null, end_date = null }: PartOfTermInterface) {
    Object.assign(this, { id, name, start_date, end_date })
  }
}
