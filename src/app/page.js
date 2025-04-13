
import TabSwitcher from '@/components/TabSwitcher';
import DashboardHeader from '../components/DashboardHeader';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <DashboardHeader />
      <TabSwitcher />
    </main>
  )
}
