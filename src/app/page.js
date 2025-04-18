
import TabSwitcher from '@/components/TabSwitcher';
import DashboardHeader from '../components/DashboardHeader';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-6 px-16 sm:px-2 dark:bg-gray-800">
      <DashboardHeader />
      <TabSwitcher />
    </main>
  )
}
