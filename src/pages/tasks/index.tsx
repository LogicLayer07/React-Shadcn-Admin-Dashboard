import { useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { tasks as initialTasks } from './data/tasks'
import { Task } from './data/schema'

export default function Tasks() {
  const [tasksData, setTasksData] = useState<Task[]>(initialTasks)
  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    const newId = `TASK-${tasksData.length + 1}`;
    const taskWithId: Task = {
      ...newTask,
      id: newId,
    };
    setTasksData([taskWithId, ...tasksData]);
  };
  
  const editTask = (id: string, updatedTask: Partial<Task>) => {
    setTasksData(tasksData.map(task => task.id === id ? { ...task, ...updatedTask } : task))
  }

  const deleteTask = (id: string) => {
    setTasksData(tasksData.filter(task => task.id !== id))
  }

  const copyTask = (id: string) => {
    const taskToCopy = tasksData.find(task => task.id === id)
    if (taskToCopy) {
      const newTask = {
        ...taskToCopy,
        id: `TASK-${Math.floor(Math.random() * 10000)}`,
        title: `Copy of ${taskToCopy.title}`
      }
      setTasksData([...tasksData, newTask])
    }
  }

  const labelTask = (id: string, label: string) => {
    setTasksData(tasksData.map(task => 
      task.id === id ? { ...task, label } : task
    ))
  }

  const taskColumns = columns({
    editTask,
    deleteTask,
    copyTask,
    labelTask,
  })

  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Welcome back!</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your tasks for this month!
            </p>
          </div>
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <DataTable data={tasksData} columns={taskColumns} handleCreateTask={handleCreateTask} />
        </div>
      </Layout.Body>
    </Layout>
  )
}