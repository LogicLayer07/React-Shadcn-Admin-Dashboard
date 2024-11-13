
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import CalendarPage from './components/calendar'

export default function Calendar() {
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
          <CalendarPage />
        </Layout.Body>
      </Layout>
    )
}