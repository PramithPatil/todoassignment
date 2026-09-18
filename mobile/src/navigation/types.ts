export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  TaskList: undefined;
  AddEditTask: { taskId?: string } | undefined;
  TaskDetail: { taskId: string };
};
