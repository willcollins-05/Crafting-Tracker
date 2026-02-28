'use server'
import { Item, Task } from '@/types/dbtypes';
import { getAllTasks } from '@/app/repository/maindbrepo';
import MainDashboard from '@/components/main-components/MainDashboard';
import { FullTask } from '@/app/repository/dtos';

export default async function Home() {
  const tasksResponse: FullTask[] = await getAllTasks();

  return (
    <MainDashboard tasks={tasksResponse} />
  );
}
