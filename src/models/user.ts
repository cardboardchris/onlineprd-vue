interface UserInterface {
    id?: number
    prefix_id?: number
    firstName?: string
    lastName?: string
    email?: string
    avatar?: string
    rules?: []
    roles?: []
    accessToken?: string
    eclass_id?: number
    verified?: number
}

export class User {
    public id: number
    public prefix_id: number
    public firstName: string
    public lastName: string
    public email: string
    public avatar: string
    public rules: []
    public roles: []
    public accessToken: string
    public eclass_id: number
    public verified: number

    public constructor ({ id = null, prefix_id = null, firstName = '', lastName = '', email = '', avatar = '', rules = [], roles = [], accessToken = '', eclass_id = null, verified = null }: UserInterface) {
      Object.assign(this, { id, prefix_id, firstName, lastName, email, avatar, rules, roles, accessToken, eclass_id, verified })
    }
}
