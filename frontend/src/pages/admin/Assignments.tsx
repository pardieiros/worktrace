import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchAssignments } from "@/lib/queries";

export function AdminAssignmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["assignments"],
    queryFn: () => fetchAssignments()
  });

  const assignments = data?.results ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-text">Atribuições</h1>
        <p className="text-sm text-primary/70">
          Controle quem pode registar tempo e com que permissões dentro de cada projeto.
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projeto</TableHead>
              <TableHead>Utilizador</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>A carregar...</TableCell>
              </TableRow>
            )}
            {!isLoading &&
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.project_name}</TableCell>
                  <TableCell>{assignment.user_email}</TableCell>
                  <TableCell>
                    <Badge variant={assignment.role === "manager" ? "success" : "neutral"}>
                      {assignment.role === "manager" ? "Gestor" : "Membro"}
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment.is_active ? "Activo" : "Inactivo"}</TableCell>
                </TableRow>
              ))}
            {!isLoading && assignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>Sem atribuições registadas.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

