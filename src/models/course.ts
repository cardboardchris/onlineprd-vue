interface CourseInterface {
  id?: number
  department_id?: number
  term_id?: number
  subject_id?: number
  number?: number
  credit_hours?: string
}

export class Course {
  public id: number
  public department_id: number
  public term_id: number
  public subject_id: number
  public number: number
  public credit_hours: string

  public constructor ({ id = null, department_id = null, term_id = null, subject_id = null, number = null, credit_hours = '' }: CourseInterface) {
    Object.assign(this, { id, department_id, term_id, subject_id, number, credit_hours })
  }
}
