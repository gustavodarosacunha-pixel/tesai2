import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/app/AppLayout'
import { ProjectsDashboard } from '@/features/projects/pages/ProjectsDashboard'
import { ProjectDetailPage } from '@/features/projects/pages/ProjectDetailPage'
import { useProjectStore } from '@/store/projectStore'

function App() {
  const selectedProjectId = useProjectStore((state) => state.selectedProjectId)

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<ProjectsDashboard />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route
          path="*"
          element={<Navigate to={selectedProjectId ? `/projects/${selectedProjectId}` : '/'} replace />}
        />
      </Route>
    </Routes>
  )
}

export default App
