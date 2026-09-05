import { Link, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

import { AuthShell } from '@/components/layout/auth-shell';
import { Button } from '@/components/ui/button';
import { Field, Input, Label } from '@/components/ui/field';
import { Stepper } from '@/components/ui/misc';
import { PasswordInput } from '@/components/ui/password-input';
import { errorMessage, useSignUp } from '@/hooks/use-session';
import { cn } from '@/lib/cn';

export const Route = createFileRoute('/_public/signup')({ component: SignUpPage });

const STRENGTH_LABELS = ['Senha fraca', 'Senha média', 'Boa senha'];

function SignUpPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = useSignUp();
  const failure = errorMessage(signUp.error);

  const strength = Math.min(3, Math.floor(password.length / 4));
  const ready = name.trim().length > 1 && email.includes('@') && password.length >= 8;

  return (
    <AuthShell logo={false}>
      <div className="flex items-center justify-between">
        <Link
          to="/"
          aria-label="Voltar"
          className="grid size-10 place-items-center rounded-control border-[1.5px] border-line text-lg text-ink"
        >
          ←
        </Link>
        <p className="font-mono text-micro tracking-[0.12em] text-muted">PASSO 1 DE 2</p>
      </div>

      <Stepper current={1} total={2} className="mt-6" />

      <h1 className="mt-6 text-title text-ink">Criar sua conta</h1>
      <p className="mt-2 text-sm text-muted">Depois você convida a outra pessoa.</p>

      <form
        className="mt-7 flex flex-col gap-4.5"
        onSubmit={(event) => {
          event.preventDefault();
          signUp.mutate(
            { name, email, password },
            { onSuccess: () => void navigate({ to: '/invite' }) },
          );
        }}
      >
        <Field label="Nome">
          {(id) => (
            <Input
              id={id}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ana Ribeiro"
              autoFocus
            />
          )}
        </Field>

        <Field label="E-mail">
          {(id) => (
            <Input
              id={id}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="ana@duo.app"
            />
          )}
        </Field>

        <div className="flex flex-col gap-2">
          <Label htmlFor="new-password">Senha</Label>
          <PasswordInput
            id="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={cn('h-1 w-10 rounded-pill', index < strength ? 'bg-accent' : 'bg-line')}
              />
            ))}
            {password ? (
              <span className="ml-1 text-caption text-muted">
                {STRENGTH_LABELS[Math.max(0, strength - 1)]}
              </span>
            ) : null}
          </div>
        </div>

        {failure ? (
          <p role="alert" className="text-caption font-medium text-accent">
            {failure}
          </p>
        ) : null}

        <Button type="submit" size="lg" block disabled={!ready || signUp.isPending}>
          {signUp.isPending ? 'Criando conta…' : 'Continuar'}
        </Button>
      </form>
    </AuthShell>
  );
}
