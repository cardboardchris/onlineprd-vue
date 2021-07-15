<template>
  <div>
    <b-row>

      <b-col>
        <label>Office:</label> <span v-if="department">{{ this.department.department_office_number }} {{ this.department.department_building }}</span>
      </b-col>

      <b-col>
        <label>Chair:</label> <span
        v-if="department">{{ this.department.chair }}</span>
      </b-col>

      <b-col>
        <label>ORG #:</label> <span
        v-if="department">{{ this.department.org_number }}</span>
      </b-col>

    </b-row>

<!--    <b-row>-->

<!--      <b-col>-->
<!--        <label>Department contact:</label> <span v-if="department.contact_user">{{ this.department.contact_user.first_name }} {{ this.department.contact_user.last_name }}</span>-->
<!--      </b-col>-->

<!--      <b-col>-->
<!--        <label>Contact email:</label> <span-->
<!--        v-if="department.contact_user">{{ this.department.contact_user.email }}</span>-->
<!--      </b-col>-->

<!--      <b-col>-->
<!--        <label>Contact phone:</label> <span v-if="department">{{ this.department.department_phone_number }}</span>-->
<!--      </b-col>-->

<!--    </b-row>-->
  </div>
</template>

<script>
export default {
  name: 'DepartmentInfo',
  props: {
    department: Object
  }
}
</script>
