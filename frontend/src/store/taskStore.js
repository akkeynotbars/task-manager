import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  tasks: {},

  setTasks: (tasks) =>
    set({ tasks: Object.fromEntries(tasks.map(t => [t.id, t])) }),

  setTask: (task) =>
    set((state) => ({ tasks: { ...state.tasks, [task.id]: task } })),

  removeTask: (taskId) =>
    set((state) => {
      const tasks = { ...state.tasks };
      delete tasks[taskId];
      return { tasks };
    }),
}));