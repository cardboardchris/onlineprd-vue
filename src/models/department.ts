interface DepartmentInterface {
  id?: number
  org_number?: number
  chair?: string
  name?: string
  abbreviation?: string
  department_building?: string
  department_office_number?: string
  department_phone_number?: string
  contact_user_id?: number
  college_id?: string
}

export class Department {
  public id: number
  public org_number: number
  public chair: string
  public name: string
  public abbreviation: string
  public department_building: string
  public department_office_number: string
  public department_phone_number: string
  public contact_user_id: number
  public college_id: string

  public constructor ({ id = null, org_number = null, chair = null, name = null, abbreviation = null, department_building = null, department_office_number = null, department_phone_number = null, contact_user_id = null, college_id = null }: DepartmentInterface) {
    Object.assign(this, { id, org_number, chair, name, abbreviation, department_building, department_office_number, department_phone_number, contact_user_id, college_id })
  }
}
