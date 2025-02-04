
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
│  │  │  ├─ 20250202073501_init_quotation
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202075628_add_approval_fields_to_quotation
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202103801_add_approval_fields_creator_quot
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202142519_fix_approval_note
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202153924_fix_qp_id
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202154330_fix_qp_id
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250203164522_add_field_customer_company
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250203165013_add_field_quotation_top
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250203165204_fix_field_quotation_top
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  └─ schema.prisma
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config
│  │  │  ├─ db.ts
│  │  │  ├─ logger.ts
│  │  │  └─ nodemailer.ts
│  │  ├─ controllers
│  │  │  ├─ auth.controller.ts
│  │  │  └─ quotation.controller.ts
│  │  ├─ logs
│  │  │  ├─ .3a489d88a1ce35b98dfd2e90489230535505566a-audit.json
│  │  │  ├─ .5938cde9c50ed57834ee6b7fe9ae81c5df9806c9-audit.json
│  │  │  ├─ .8c92e4a4108e9b0a78b09dc53625d9e7cc2f757a-audit.json
│  │  │  ├─ combined-2025-02-02.log
│  │  │  ├─ combined-2025-02-04.log
│  │  │  ├─ error-2025-02-02.log
│  │  │  └─ error-2025-02-04.log
│  │  ├─ middleware
│  │  │  ├─ auth.middleware.ts
│  │  │  ├─ morgan.middleware.ts
│  │  │  └─ rateLimit.ts
│  │  ├─ routes
│  │  │  ├─ auth.routes.ts
│  │  │  └─ quotation.routes.ts
│  │  ├─ server.ts
│  │  ├─ services
│  │  │  └─ email.service.ts
│  │  ├─ templates
│  │  │  └─ quotationTemplate.ts
│  │  ├─ types
│  │  │  └─ express
│  │  │     └─ index.d.ts
│  │  └─ utils
│  │     ├─ documentNumber.ts
│  │     ├─ emailTemplates.ts
│  │     ├─ jwt.ts
│  │     └─ pdfGenerator.ts
│  └─ tsconfig.json
└─ README.md

```
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
│  │  │  ├─ 20250202073501_init_quotation
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202075628_add_approval_fields_to_quotation
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202103801_add_approval_fields_creator_quot
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202142519_fix_approval_note
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202153924_fix_qp_id
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250202154330_fix_qp_id
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250203164522_add_field_customer_company
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250203165013_add_field_quotation_top
│  │  │  │  └─ migration.sql
│  │  │  ├─ 20250203165204_fix_field_quotation_top
│  │  │  │  └─ migration.sql
│  │  │  └─ migration_lock.toml
│  │  ├─ schema.prisma
│  │  └─ seed.ts
│  ├─ src
│  │  ├─ app.ts
│  │  ├─ config
│  │  │  ├─ db.ts
│  │  │  ├─ logger.ts
│  │  │  └─ nodemailer.ts
│  │  ├─ controllers
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ quotation.controller.ts
│  │  │  └─ user.controller.ts
│  │  ├─ logs
│  │  │  ├─ .3a489d88a1ce35b98dfd2e90489230535505566a-audit.json
│  │  │  ├─ .5938cde9c50ed57834ee6b7fe9ae81c5df9806c9-audit.json
│  │  │  ├─ .8c92e4a4108e9b0a78b09dc53625d9e7cc2f757a-audit.json
│  │  │  ├─ combined-2025-02-02.log
│  │  │  ├─ combined-2025-02-04.log
│  │  │  ├─ error-2025-02-02.log
│  │  │  └─ error-2025-02-04.log
│  │  ├─ middleware
│  │  │  ├─ auth.middleware.ts
│  │  │  ├─ morgan.middleware.ts
│  │  │  └─ rateLimit.ts
│  │  ├─ routes
│  │  │  ├─ auth.routes.ts
│  │  │  └─ quotation.routes.ts
│  │  ├─ server.ts
│  │  ├─ services
│  │  │  └─ email.service.ts
│  │  ├─ templates
│  │  │  └─ quotationTemplate.ts
│  │  ├─ types
│  │  │  └─ express
│  │  │     └─ index.d.ts
│  │  └─ utils
│  │     ├─ documentNumber.ts
│  │     ├─ emailTemplates.ts
│  │     ├─ jwt.ts
│  │     └─ pdfGenerator.ts
│  └─ tsconfig.json
└─ README.md

```