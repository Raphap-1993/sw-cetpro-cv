import { loginAction } from "../actions";

export function AdminLoginForm() {
  return (
    <form action={loginAction} className="adminForm">
      <label className="adminField">
        Correo administrativo
        <input
          autoComplete="email"
          name="email"
          placeholder="admin@cetpro.local"
          required
          type="email"
        />
      </label>
      <label className="adminField">
        Password
        <input
          autoComplete="current-password"
          name="password"
          placeholder="Tu password"
          required
          type="password"
        />
      </label>
      <button className="adminButton" type="submit">
        Ingresar al backoffice
      </button>
    </form>
  );
}
