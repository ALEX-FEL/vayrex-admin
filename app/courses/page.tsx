import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { getRides } from '@/lib/db';
import { CoursesTable } from './table';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const rides = await getRides(300);

  return (
    <DashboardLayout>
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-foreground">Courses</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{rides.length} courses trouvées</p>
        </div>
        <CoursesTable rides={rides} />
      </div>
    </DashboardLayout>
  );
}
