import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { AuthShell } from '@/components/layout/auth-shell';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, Input, Label } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';

export const Route = createFileRoute('/_public/login')({ component: LoginPage });

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('ana@duo.app');
  const [password, setPassword] = useState('duoduo12');
  const [stayed, setStayed] = useState(true);

  return (
    <AuthShell showcase>
      <h1 className="mt-7 text-title text-ink">
        Bem-vindo
        <br />
        de volta.
      </h1>
      <p className="mt-2 text-sm text-muted">Entre para ver o painel compartilhado.</p>

      <form
        className="mt-7 flex flex-col gap-4.5"
        onSubmit={(event) => {
          event.preventDefault();
          void navigate({ to: '/dashboard' });
        }}
      >
        <Field label="E-mail">
          {(id) => (
            <Input
              id={id}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          )}
        </Field>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox checked={stayed} onChange={setStayed} label="Manter conectada" hideLabel />
            <span className="text-label text-ink-soft">Manter conectada</span>
          </label>
          <button type="button" className="cursor-pointer text-label font-medium text-accent">
            Esqueci a senha
          </button>
        </div>

        <Button type="submit" size="lg" block>
          Entrar
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-caption text-subtle">ou</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="flex flex-col gap-3">
        <Button variant="secondary" size="lg" block className="rounded-panel font-medium">
          <span className="font-mono text-label text-muted">G</span> Continuar com Google
        </Button>
        <Button variant="secondary" size="lg" block className="rounded-panel font-medium">
          <span className="font-mono text-label text-muted">#</span> Entrar com código do convite
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Novo por aqui?{' '}
        <Link to="/signup" className="font-semibold text-accent">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  );
}
