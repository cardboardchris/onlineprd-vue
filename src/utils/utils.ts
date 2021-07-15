export default class Utils {
  // convert object keys to from snake case to camel case
  static keysToCamel (o: object) {
    if (this.isObject(o)) {
      const n = {}

      Object.keys(o)
        .forEach((k) => {
          n[this.toCamel(k)] = this.keysToCamel(o[k])
        })

      return n
    } else if (o instanceof Array) {
      return o.map((i) => {
        return this.keysToCamel(i)
      })
    }

    return o
  }

  static toCamel (s: string) {
    return s.replace(/([-_][a-z])/ig, ($1) => {
      return $1.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    })
  }

  static isObject (o: any) {
    return (o === Object(o)) && !(o instanceof Array) && (typeof o !== 'function')
  }
}
