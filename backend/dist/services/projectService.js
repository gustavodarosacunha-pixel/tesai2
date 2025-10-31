"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectService = void 0;
const mockData_1 = require("../data/mockData");
class ProjectService {
    projects = new Map(mockData_1.mockProjects.map((project) => [project.id, structuredClone(project)]));
    listProjects() {
        return Array.from(this.projects.values()).map((project) => {
            const { tasks, ...summary } = project;
            return summary;
        });
    }
    getProject(projectId) {
        const project = this.projects.get(projectId);
        return project ? structuredClone(project) : undefined;
    }
    upsertProject(project) {
        const updated = structuredClone(project);
        this.projects.set(project.id, updated);
        return this.getProject(project.id);
    }
    updateTask(projectId, patch) {
        const project = this.projects.get(projectId);
        if (!project)
            return undefined;
        const index = project.tasks.findIndex((task) => task.id === patch.id);
        if (index >= 0) {
            project.tasks[index] = { ...project.tasks[index], ...patch };
        }
        else {
            project.tasks.push(patch);
        }
        project.updatedAt = new Date().toISOString();
        this.projects.set(projectId, project);
        return this.getProject(projectId);
    }
    createTask(projectId, task) {
        return this.updateTask(projectId, task);
    }
}
exports.projectService = new ProjectService();
//# sourceMappingURL=projectService.js.map