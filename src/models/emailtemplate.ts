interface EmailTemplateInterface {
  id?: number
  name?: string
  type?: string
  body?: string
  active?: number
}

export class EmailTemplate {
  public id: number
  public name: string
  public type: string
  public body: string
  public active: number

  public constructor ({
    id = null,
    name = null,
    type = null,
    body = null,
    active = null
  }: EmailTemplateInterface) {
    Object.assign(this,
      {
        id,
        name,
        type,
        body,
        active
      })
  }
}
