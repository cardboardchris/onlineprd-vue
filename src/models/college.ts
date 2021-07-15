interface CollegeInterface {
    id?: number
    abbreviation?: string
    name?: number
    active?: number
}

export class College {
    public id: number
    public abbreviation: string
    public name: string
    public active: number

    public constructor ({ id = null, abbreviation = null, name = null, active = null }: CollegeInterface) {
      Object.assign(this, { id, abbreviation, name, active })
    }
}
