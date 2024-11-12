import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([

  {
    path: '/',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/kanban')).default,
        }),
      },
      {
        path: 'kanban',
        lazy: async () => ({
          Component: (await import('@/pages/kanban')).default,
        }),
      },
      {
        path: 'product',
        lazy: async () => ({
          Component: (await import('./pages/product')).default,
        }),
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/product/list')).default,
            }),
          },
          {
            path: 'add',
            lazy: async () => ({
              Component: (await import('./pages/product/add')).default,
            }),
          },
        ],
      },
      {
        path: 'chats',
        lazy: async () => ({
          Component: (await import('@/pages/chats')).default,
        }),
      },
    ],
  },
  

  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  { path: '*', Component: NotFoundError },
])

export default router
