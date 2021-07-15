import AnyTableService from './anyTable.service'

class CourseService extends AnyTableService {
  endpoint = 'courses'

  getCourse (id, params = {}) {
    return this.retrieveTableRowById(this.endpoint, id, params)
  }

  getCourses (params = {}) {
    return this.retrieveTableRows(this.endpoint, params)
  }

  saveNewCourse (courseObject) {
    return this.createNewTableRow(this.endpoint, courseObject)
  }

  deleteCourse (id) {
    return this.deleteTableRowById(this.endpoint, id)
  }
}

export const courseService = new CourseService()
