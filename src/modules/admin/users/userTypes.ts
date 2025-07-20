export enum FormMode {
  EDIT = 'edit',
  CREATE = 'create',
}

interface UserFormConfig {
  title: string
  buttonTitle: string
  buttonIcon: string
}
export const userSettings: Record<FormMode, UserFormConfig> = {
  create: { title: 'Create New User', buttonTitle: 'Create User', buttonIcon: 'mdi-account-plus' },
  edit: { title: 'Edit User', buttonTitle: 'Update User', buttonIcon: 'mdi-account-edit' },
}
