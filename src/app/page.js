
import TabSwitcher from '@/components/TabSwitcher';
import DashboardHeader from '../components/DashboardHeader';


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-6 px-16">
      <DashboardHeader />
      <TabSwitcher />
    </main>
  )
}
