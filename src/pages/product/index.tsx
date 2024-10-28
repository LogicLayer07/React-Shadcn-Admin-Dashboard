import { Outlet } from 'react-router-dom'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

export default function products() {
  return (
    <Layout fixed>
     <Layout.Header>
        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>
      <Layout.Body className='flex flex-col'>
        <Outlet />
      </Layout.Body>
    </Layout>
  )
}
