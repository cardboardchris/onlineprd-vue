import Home from '../views/Home'
import DashboardTermSelect from '../views/DashboardTermSelect'
import HomeDashboard from '../views/HomeDashboard'
import EmployeeProfileForm from '../views/EmployeeProfileForm'
import CourseList from '../views/CourseList'
import AssignmentsByCourse from '../views/AssignmentsByCourse'
import DepartmentList from '../views/DepartmentList'
import AssignmentsByDepartment from '../views/AssignmentsByDepartment'
import AssignmentsByUserDashboard from '../views/AssignmentsByUser'
import NonCourseAssignments from '../views/NonCourseAssignments'
import Eclasses from '../views/Eclasses'
import Login from '../views/Login'
import Users from '../views/Users'
import Departments from '../views/Departments'
import AcceptanceForm from '../views/AcceptanceForm'
import User from '../views/User'
import UserNew from '../views/UserAdd'
import LoggedOut from '../views/LoggedOut'
import SessionEnded from '../views/SessionEnded'
import Terms from '../views/Terms'
import PartsOfTerm from '../views/PartsOfTerm'
import FormFieldLookups from '../views/FormFieldLookups'
import EmailTemplates from '../views/EmailTemplates'
import AppointmentLetterPreview from '../views/AppointmentLetterPreview'

export const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
    meta: {
      breadcrumbs: []
    }
  },
  {
    name: 'logged-out',
    path: '/logged-out',
    component: LoggedOut,
    meta: {
      breadcrumbs: []
    }
  },
  {
    name: 'session-ended',
    path: '/session-ended',
    component: SessionEnded,
    meta: {
      breadcrumbs: []
    }
  },
  {
    name: 'employeeform',
    path: '/profile/:user_id',
    component: EmployeeProfileForm,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'My Employee Profile' }
      ]
    }
  },
  {
    name: 'acceptanceform',
    path: '/dashboard/assignments/:term_id/:user_id',
    component: AcceptanceForm,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Assignments' }
      ]
    }
  },
  {
    name: 'eclassesform',
    path: '/dashboard/eclasses',
    component: Eclasses,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Eclass Administration' }
      ]
    }
  },
  {
    name: 'termlist',
    path: '/dashboard/terms',
    component: Terms,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Terms Administration' }
      ]
    }
  },
  {
    name: 'partsofterm',
    path: '/dashboard/terms/:term_id',
    component: PartsOfTerm,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Terms Administration', to: { name: 'termlist' } },
        { text: 'Loading...' }
      ]
    }
  },
  {
    name: 'courselist',
    path: '/dashboard/schedule-courses/:term_id/:department_id',
    component: CourseList,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Schedule Courses' }
      ]
    }
  },
  {
    name: 'departmentlist',
    path: '/dashboard/assignments-by-department/:term_id',
    component: DepartmentList,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Assignments by Department' }
      ]
    }
  },
  {
    name: 'assignmentsbycourse',
    path: '/dashboard/assignments-by-course/:term_id/:department_id/:course_id',
    component: AssignmentsByCourse,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Schedule Courses', to: { name: 'courselist' } },
        { text: 'Course loading...' }
      ]
    }
  },
  {
    name: 'assignmentsbydepartment',
    path: '/dashboard/assignments-by-department/:term_id/:department_id',
    component: AssignmentsByDepartment,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Assignments by Department', to: { name: 'departmentlist' } },
        { text: 'Department loading...' }
      ]
    }
  },
  {
    name: 'noncourseassignments',
    path: '/dashboard/non-course-assignments/:term_id/:department_id',
    component: NonCourseAssignments,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Schedule Courses', to: { name: 'courselist' } },
        { text: 'Non-Course Assignments' }
      ]
    }
  },
  {
    name: 'assignmentsbyuser',
    path: '/dashboard/assignments-by-employee/:term_id',
    component: AssignmentsByUserDashboard,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Term loading...', to: { name: 'dashboard' } },
        { text: 'Assignments by Employee' }
      ]
    }
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
    meta: {
      breadcrumbs: []
    }
  },
  {
    name: 'users',
    path: '/dashboard/users',
    component: Users,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Users Administration', to: { name: 'users' } }
      ]
    }
  },
  {
    name: 'add-user',
    path: '/dashboard/users/add/',
    component: UserNew,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Users Administration', to: { name: 'users' } },
        { text: 'Add User' }
      ]
    }
  },
  {
    name: 'user',
    path: '/dashboard/users/:id',
    component: User,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Users Administration', to: { name: 'users' } },
        { text: 'Loading...' }
      ]
    }
  },
  {
    name: 'formfieldlookups',
    path: '/dashboard/form-field-lookups',
    component: FormFieldLookups,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard' } },
        { text: 'Form Field Lookups Administration' }
      ]
    }
  },
  {
    name: 'emailtemplates',
    path: '/dashboard/email-templates',
    component: EmailTemplates,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Letter Templates Administration' }
      ]
    }
  },
  {
    name: 'letterpreview',
    path: '/appointment-letter-preview/:term_id/:user_id',
    component: AppointmentLetterPreview,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Registration Dashboard', to: { name: 'departmentlist' } },
        { text: 'Appointment Letter Preview' }
      ]
    }
  },
  {
    name: 'departments',
    path: '/dashboard/departments',
    component: Departments,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Departments Administration', to: { name: 'users' } }
      ]
    }
  },
  {
    name: 'dashboard-term-select',
    path: '/dashboard',
    component: DashboardTermSelect,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard' }
      ]
    }
  },
  {
    name: 'dashboard',
    path: '/dashboard/:term_id',
    component: HomeDashboard,
    props: true,
    meta: {
      breadcrumbs: [
        { text: 'Dashboard', to: { name: 'dashboard-term-select' } },
        { text: 'Loading...' }
      ]
    }
  }
]
