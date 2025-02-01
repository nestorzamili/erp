
```
navindo
├─ backend
│  ├─ .env
│  ├─ dist
│  │  ├─ app.js
│  │  ├─ config
│  │  │  └─ db.js
│  │  ├─ controllers
│  │  │  └─ auth.controller.js
│  │  ├─ middleware
│  │  │  └─ auth.middleware.js
│  │  ├─ routes
│  │  │  └─ auth.routes.js
│  │  ├─ server.js
│  │  └─ utils
│  │     └─ jwt.js
│  ├─ nodemon.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ prettier.config.js
│  ├─ prisma
│  │  ├─ migrations
│  │  │  ├─ 20250201074920_add_field_name_role_to_user
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250201121930_add_field_email_verification
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250201181903_add_reset_password
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  └─ schema.prisma
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config
│  │  │  ├─ db.ts
│  │  │  └─ nodemailer.ts
│  │  ├─ controllers
│  │  │  └─ auth.controller.ts
│  │  ├─ middleware
│  │  │  ├─ auth.middleware.ts
│  │  │  └─ rateLimit.ts
│  │  ├─ routes
│  │  │  └─ auth.routes.ts
│  │  ├─ server.ts
│  │  ├─ services
│  │  │  └─ email.service.ts
│  │  ├─ types
│  │  │  └─ express
│  │  │     └─ index.d.ts
│  │  └─ utils
│  │     ├─ emailTemplates.ts
│  │     └─ jwt.ts
│  └─ tsconfig.json
└─ README.md

```