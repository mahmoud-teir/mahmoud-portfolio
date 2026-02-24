import { BetterAuth } from 'some-auth-library';
import { DatabaseAdapter } from 'your-database-adapter-path';

const trustedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://mahmoud-portfolio-phi.vercel.app',
];

const auth = new BetterAuth({
  adapter: new DatabaseAdapter(),
  session: {
    secret: process.env.SESSION_SECRET, // Set your session secret
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
    },
  },
  email: {
    from: 'no-reply@yourdomain.com',
    sendVerification: true,
  },
  password: {
    minimumLength: 8,
  },
  hooks: {
    onLogin: async (user) => {
      // Custom login logic
    },
    onLogout: async (user) => {
      // Custom logout logic
    }
  },
  trustedOrigins: trustedOrigins,
});

export default auth;