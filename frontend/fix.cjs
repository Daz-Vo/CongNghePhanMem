const fs = require('fs');

// 1. AppSidebar.tsx
let f = 'src/components/Sidebar/AppSidebar.tsx';
let content = fs.readFileSync(f, 'utf8');
content = content.replace('currentUser?.is_superuser', '(currentUser as any)?.is_superuser');
fs.writeFileSync(f, content);

// 2. User.tsx
f = 'src/components/Sidebar/User.tsx';
content = fs.readFileSync(f, 'utf8');
content = content.replace('to="/settings"', 'to="/"');
fs.writeFileSync(f, content);

// 3. chat.tsx
f = 'src/routes/_layout/chat.tsx';
content = fs.readFileSync(f, 'utf8');
content = content.replace('onError: (error) => {', 'onError: (_error) => {');
fs.writeFileSync(f, content);

// 4. login.tsx
f = 'src/routes/login.tsx';
content = fs.readFileSync(f, 'utf8');
content = content.replace('Body_login_login_access_token', 'Body_login_access_token_api_v1_auth_login_access_token_post');
fs.writeFileSync(f, content);

// 5. recover-password.tsx
f = 'src/routes/recover-password.tsx';
content = fs.readFileSync(f, 'utf8');
content = content.replace('LoginService', 'AuthService');
content = content.replace('LoginService.recoverPassword({', 'AuthService.forgotPasswordApiV1AuthForgotPasswordPost({');
fs.writeFileSync(f, content);

// 6. reset-password.tsx
f = 'src/routes/reset-password.tsx';
content = fs.readFileSync(f, 'utf8');
content = content.replace('LoginService', 'AuthService');
content = content.replace('LoginService.resetPassword({', 'AuthService.resetPasswordApiV1AuthResetPasswordPost({');
fs.writeFileSync(f, content);
