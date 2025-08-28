import { useKV } from '@github/spark/hooks'
import type { Task, Project } from '@/types'

export function useTasks() {
  const [tasks, setTasks] = useKV<Task[]>('tasks', [])

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setTasks(currentTasks => [...currentTasks, newTask])
    return newTask
  }

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(currentTasks => 
      currentTasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    )
  }

  const deleteTask = (taskId: string) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId))
  }

  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId)
  }

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status)
  }

  const getTasksByClient = (clientId: string) => {
    return tasks.filter(task => task.client === clientId)
  }

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getTasksByStatus,
    getTasksByClient
  }
}

export function useProjects() {
  const [projects, setProjects] = useKV<Project[]>('projects', [])

  const addProject = (project: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    setProjects(currentProjects => [...currentProjects, newProject])
    return newProject
  }

  const updateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(currentProjects => 
      currentProjects.map(project => 
        project.id === projectId ? { ...project, ...updates } : project
      )
    )
  }

  const deleteProject = (projectId: string) => {
    setProjects(currentProjects => currentProjects.filter(project => project.id !== projectId))
  }

  const getProjectsByClient = (clientId: string) => {
    return projects.filter(project => project.client === clientId)
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectsByClient
  }
}