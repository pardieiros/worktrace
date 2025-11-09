import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text">Definições</h1>
        <p className="text-sm text-primary/70">
          Configure branding, notificações e parâmetros de segurança.
        </p>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text">Branding</h2>
          <p className="text-sm text-primary/70">
            Actualize o logótipo da empresa para uso na área do cliente.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da empresa</Label>
            <Input id="company-name" placeholder="Worktrace Demo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-email">Email de suporte</Label>
            <Input id="support-email" placeholder="support@worktrace.app" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="logo-upload">Logótipo (SVG, PNG)</Label>
          <Input id="logo-upload" type="file" accept=".svg,.png" />
        </div>
        <Button className="mt-2">Guardar alterações</Button>
      </Card>

      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-text">Segurança</h2>
          <p className="text-sm text-primary/70">
            Controla as opções de CSRF e limites de taxa para a API.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="csrf-origins">CSRF trusted origins</Label>
            <Input id="csrf-origins" placeholder="http://localhost:5173" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cors-origins">CORS allowed origins</Label>
            <Input id="cors-origins" placeholder="http://localhost:5173" />
          </div>
        </div>
        <Button variant="outline">Aplicar segurança</Button>
      </Card>
    </div>
  );
}


