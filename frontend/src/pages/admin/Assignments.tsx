import type { ChangeEvent, FormEvent } from "react";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { createAssignment, fetchAssignments, fetchProjects, fetchUsers } from "@/lib/queries";
import type { CreateAssignmentPayload } from "@/lib/queries";
import type { Project, User } from "@/lib/types";

type AssignmentFormState = {
  projectId: string;
  userId: string;
  role: "member" | "manager";
};

const defaultFormState: AssignmentFormState = {
  projectId: "",
  userId: "",
  role: "member"
};

const formatUserLabel = (user: User) => {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  return fullName ? `${fullName} (${user.email})` : user.email;
};

const parseErrorMessage = (error: unknown, fallback: string) => {
  if (isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
    if (error.response?.data && typeof error.response.data === "object") {
      const values = Object.values(error.response.data);
      if (values.length > 0 && typeof values[0] === "string") {
        return values[0];
      }
    }
  }
  return fallback;
};

export function AdminAssignmentsPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValues, setFormValues] = useState<AssignmentFormState>(defaultFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => fetchAssignments()
  });

  const { data: projectsData, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects", "assignment-options"],
    queryFn: () => fetchProjects({ page_size: 100 })
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users", "admins"],
    queryFn: () => fetchUsers({ role: "ADMIN", page_size: 100 })
  });

  const projects = useMemo(() => projectsData?.results ?? [], [projectsData]);
  const adminUsers = useMemo(
    () => (usersData?.results ?? []).filter((user: User) => user.role === "ADMIN"),
    [usersData]
  );

  const createAssignmentMutation = useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => createAssignment(payload),
    onSuccess: () => {
      setFormError(null);
      setFormValues(defaultFormState);
      setIsModalOpen(false);
      void queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error: unknown) => {
      setFormError(parseErrorMessage(error, t("admin.assignments.errors.createFallback")));
    }
  });

  const assignments = data?.results ?? [];
  const isOptionsLoading = isLoadingProjects || isLoadingUsers;

  const handleOpenModal = () => {
    setFormError(null);
    setFormValues(defaultFormState);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
    setFormValues(defaultFormState);
  };

  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormValues((previous) => ({ ...previous, role: event.target.value as AssignmentFormState["role"] }));
  };

  const handleProjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormValues((previous) => ({ ...previous, projectId: event.target.value }));
  };

  const handleUserChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormValues((previous) => ({ ...previous, userId: event.target.value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValues.projectId) {
      setFormError(t("admin.assignments.errors.projectRequired"));
      return;
    }
    if (!formValues.userId) {
      setFormError(t("admin.assignments.errors.userRequired"));
      return;
    }
    setFormError(null);
    createAssignmentMutation.mutate({
      project: Number(formValues.projectId),
      user: Number(formValues.userId),
      role: formValues.role
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t("admin.assignments.title")}</h1>
          <p className="text-sm text-primary/70">{t("admin.assignments.subtitle")}</p>
        </div>
        <Button type="button" onClick={handleOpenModal}>
          {t("admin.assignments.actions.new")}
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.assignments.table.project")}</TableHead>
              <TableHead>{t("admin.assignments.table.user")}</TableHead>
              <TableHead>{t("admin.assignments.table.role")}</TableHead>
              <TableHead>{t("admin.assignments.table.status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>{t("common.loading")}</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.project_name}</TableCell>
                  <TableCell>{assignment.user_email}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.role === "manager" ? "success" : "neutral"}>
                      {assignment.role === "manager" ? t("common.roles.manager") : t("common.roles.member")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assignment.is_active ? t("common.status.active") : t("common.status.inactive")}
                  </TableCell>
                </TableRow>
              ))}
            {!isLoading && assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>{t("admin.assignments.table.empty")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8">
          <Card className="w-full max-w-xl p-6 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-text">{t("admin.assignments.modal.title")}</h2>
                <p className="text-sm text-primary/70">{t("admin.assignments.modal.description")}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={handleCloseModal}
                disabled={createAssignmentMutation.isPending}
              >
                {t("common.actions.close")}
              </Button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                {formError}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="assignment-project">
                  {t("admin.assignments.form.projectLabel")}
                </label>
                <select
                  id="assignment-project"
                  className="h-10 w-full rounded-lg border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formValues.projectId}
                  onChange={handleProjectChange}
                  disabled={isOptionsLoading || createAssignmentMutation.isPending}
                >
                  <option value="">{t("admin.assignments.form.projectPlaceholder")}</option>
                  {projects.map((project: Project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="assignment-user">
                  {t("admin.assignments.form.userLabel")}
                </label>
                <select
                  id="assignment-user"
                  className="h-10 w-full rounded-lg border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formValues.userId}
                  onChange={handleUserChange}
                  disabled={isOptionsLoading || createAssignmentMutation.isPending}
                >
                  <option value="">{t("admin.assignments.form.userPlaceholder")}</option>
                  {adminUsers.map((user: User) => (
                    <option key={user.id} value={user.id}>
                      {formatUserLabel(user)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text" htmlFor="assignment-role">
                  {t("admin.assignments.form.roleLabel")}
                </label>
                <select
                  id="assignment-role"
                  className="h-10 w-full rounded-lg border border-primary/20 bg-white px-3 text-sm text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={formValues.role}
                  onChange={handleRoleChange}
                  disabled={createAssignmentMutation.isPending}
                >
                  <option value="member">{t("common.roles.member")}</option>
                  <option value="manager">{t("common.roles.manager")}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCloseModal}
                  disabled={createAssignmentMutation.isPending}
                >
                  {t("common.actions.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={createAssignmentMutation.isPending || isOptionsLoading}
                >
                  {createAssignmentMutation.isPending
                    ? t("admin.assignments.actions.assigning")
                    : t("admin.assignments.actions.save")}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

