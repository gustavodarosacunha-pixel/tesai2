import type { Project, ProjectSummary, Task } from '../types/project';
declare class ProjectService {
    private projects;
    listProjects(): ProjectSummary[];
    getProject(projectId: string): Project | undefined;
    upsertProject(project: Project): Project;
    updateTask(projectId: string, patch: Task): Project | undefined;
    createTask(projectId: string, task: Task): Project | undefined;
}
export declare const projectService: ProjectService;
export {};
//# sourceMappingURL=projectService.d.ts.map