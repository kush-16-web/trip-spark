# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## PostgreSQL (local dev)

Use this when you clone the repo on another machine (for example your Windows laptop at home) so you do not miss a step.

### Ubuntu (e.g. 24.04)

1. **Install** (only if Postgres is not installed yet):

   ```bash
   sudo apt update
   sudo apt install -y postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Check the umbrella service** (often shows `active (exited)` — that is normal):

   ```bash
   sudo systemctl status postgresql
   ```

3. **See the real cluster** (name may differ; example for 18 / main):

   ```bash
   pg_lsclusters
   sudo systemctl status postgresql@18-main
   ```

   Adjust `18-main` to match `pg_lsclusters` output.

4. **Verify the server answers:**

   ```bash
   psql --version
   sudo -u postgres psql -c "SELECT version();"
   ```

   You should see a version string in the query result. If something fails, note the error text.

5. Later, your app will use a **connection URL** (host, port, database, user, password) in server environment variables — that comes after you create a database and user (next phase in your setup guide).

### Windows (home laptop)

1. **Install:** Download the official Windows installer from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/) and run it. Remember the password you set for the `postgres` superuser and the port (default **5432**).

2. **Check the service:** Press **Win + R**, type `services.msc`, find **postgresql** (name includes the version), and confirm it is **Running**.

3. **Verify client:** Open **Command Prompt** or **PowerShell**. If the installer added `psql` to your PATH:

   ```text
   psql --version
   ```

4. **Test connection** (use the password you chose during install):

   ```text
   psql -U postgres -h localhost -c "SELECT version();"
   ```

5. Same as Ubuntu: later you will put a **connection URL** in the server `.env` when you wire Prisma (or another client) to this database.

### Notes

- Install and `systemctl` commands apply to **that machine only**; they are not tied to the Trip Spark project folder.
- The **frontend** never connects to Postgres directly; only the **Node server** does.
