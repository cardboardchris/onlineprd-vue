interface AssignmentInterface {
  id?: number
  user_id?: number,
  position_id?: number,
  offering_id?: number,
  eclass_id?: number,
  hours_worked?: number,
  stipend?: number,
  minimum_enrollment?: number,
  accept_assignment?: number,
  accept_prorate?: number,
  confirmed?: string,
  verified?: string,
  stipend_verified?: string,
  edited?: string,
  approved?: string,
  notified?: string,
  superseded?: string,
  accepted?: string,
  prorate_accepted?: string,
  signature?: string,
  signature_timestamp?: string
}

export class Assignment {
  public id: number
  public user_id: number
  public position_id: number
  public offering_id: number
  public eclass_id: number
  public hours_worked: number
  public stipend: number
  public minimum_enrollment: number
  public accept_assignment: number
  public accept_prorate: number
  public confirmed: string
  public verified: string
  public stipend_verified: string
  public edited: string
  public approved: string
  public notified: string
  public superseded: string
  public accepted: string
  public prorate_accepted: string
  public signature: string
  public signature_timestamp: string

  public constructor ({
    id = null,
    user_id = null,
    position_id = null,
    offering_id = null,
    eclass_id = null,
    hours_worked = null,
    stipend = null,
    minimum_enrollment = null,
    accept_assignment = null,
    accept_prorate = null,
    confirmed = null,
    verified = null,
    stipend_verified = null,
    edited = null,
    approved = null,
    notified = null,
    superseded = null,
    accepted = null,
    prorate_accepted = null,
    signature = null,
    signature_timestamp = null
  }: AssignmentInterface) {
    Object.assign(this, {
      id,
      user_id,
      position_id,
      offering_id,
      eclass_id,
      hours_worked,
      stipend,
      minimum_enrollment,
      accept_assignment,
      accept_prorate,
      confirmed,
      verified,
      stipend_verified,
      edited,
      approved,
      notified,
      superseded,
      accepted,
      prorate_accepted,
      signature,
      signature_timestamp
    })
  }
}
