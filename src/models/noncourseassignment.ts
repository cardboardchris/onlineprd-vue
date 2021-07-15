interface NonCourseAssignmentInterface {
  id?: number
  user_id?: number,
  position_id?: number,
  campus_id?: number,
  department_id?: number,
  eclass_id?: number,
  term_id?: number,
  start_date?: string,
  end_date?: string,
  hours_worked?: number,
  stipend?: number,
  accept_assignment?: number,
  confirmed?: string,
  verified?: string,
  stipend_verified?: string,
  edited?: string,
  approved?: string,
  notified?: string,
  superseded?: string,
  accepted?: string,
  signature?: string,
  signature_timestamp?: string
}

export class NonCourseAssignment {
  public id: number
  public user_id: number
  public position_id: number
  public campus_id: number
  public department_id: number
  public eclass_id: number
  public term_id: number
  public start_date: string
  public end_date: string
  public hours_worked: number
  public stipend: number
  public accept_assignment: number
  public confirmed: string
  public verified: string
  public stipend_verified: string
  public edited: string
  public approved: string
  public notified: string
  public superseded: string
  public accepted: string
  public signature: string
  public signature_timestamp: string

  public constructor ({
    id = null,
    position_id = null,
    campus_id = null,
    department_id = null,
    eclass_id = null,
    term_id = null,
    start_date = '',
    end_date = '',
    hours_worked = null,
    stipend = null,
    accept_assignment = null,
    confirmed = null,
    verified = null,
    stipend_verified = null,
    edited = null,
    approved = null,
    notified = null,
    superseded = null,
    accepted = null,
    signature = null,
    signature_timestamp = null
  }: NonCourseAssignmentInterface) {
    Object.assign(this, {
      id,
      position_id,
      campus_id,
      department_id,
      eclass_id,
      term_id,
      start_date,
      end_date,
      hours_worked,
      stipend,
      accept_assignment,
      confirmed,
      verified,
      stipend_verified,
      edited,
      approved,
      notified,
      superseded,
      accepted,
      signature,
      signature_timestamp
    })
  }
}
