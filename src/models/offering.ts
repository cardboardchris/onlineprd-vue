interface OfferingInterface {
  id?: number,
  course_id?: number,
  crn?: number,
  part_of_term_id?: number,
  campus_id?: number,
  section?: string,
  note?: string,
  maximum_enrollment?: number,
  actual_enrollment?: number,
  deleted_at?: string,
  start_date?: string,
  end_date?: string,
  confirmed?: string,
  verified?: string,
  edited?: string,
  title?: string,
  wi?: number,
  si?: number,
  meeting_days?: string,
  type_id?: number,
  start_end_times_id?: number,
  assignments?: object
}

export class Offering {
  public id: number
  public course_id: number
  public crn: number
  public part_of_term_id: number
  public campus_id: number
  public section: string
  public note: string
  public maximum_enrollment: number
  public actual_enrollment: number
  public deleted_at: string
  public start_date: string
  public end_date: string
  public confirmed: string
  public verified: string
  public edited: string
  public title: string
  public wi: number
  public si: number
  public meeting_days: string
  public type_id: number
  public start_end_times_id: number
  public assignments: object

  public constructor ({
    id = null,
    course_id = null,
    crn = null,
    part_of_term_id = null,
    campus_id = null,
    section = null,
    note = null,
    maximum_enrollment = null,
    actual_enrollment = null,
    deleted_at = null,
    start_date = null,
    end_date = null,
    confirmed = null,
    verified = null,
    edited = null,
    title = null,
    wi = 0,
    si = 0,
    meeting_days = '',
    type_id = null,
    start_end_times_id = null,
    assignments = []
  }: OfferingInterface) {
    Object.assign(this,
      {
        id,
        course_id,
        crn,
        part_of_term_id,
        campus_id,
        section,
        note,
        maximum_enrollment,
        actual_enrollment,
        deleted_at,
        start_date,
        end_date,
        confirmed,
        verified,
        edited,
        title,
        wi,
        si,
        meeting_days,
        type_id,
        start_end_times_id,
        assignments
      })
  }
}
