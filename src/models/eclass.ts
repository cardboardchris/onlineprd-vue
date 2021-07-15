interface EclassInterface {
  id?: number
  abbreviation?: string
  description?: string
  full_time?: number
  category?: string
  active?: number
  student?: string
}

export class Eclass {
  public id: number
  public abbreviation: string
  public description: string
  public full_time: number
  public category: string
  public active: number
  public student: string

  public constructor ({ id = null, abbreviation = null, description = null, full_time = null, category = null, active = null, student = null }: EclassInterface) {
    Object.assign(this, { id, abbreviation, description, full_time, category, active, student })
  }
}
