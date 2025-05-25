# Members Only

A private message board where users can create accounts, join the club with a secret passcode, and post messages. Club members can see who posted each message, and admins can delete messages.

## Features

- User authentication (signup/login)
- Club membership with secret passcode
- Admin accounts with message deletion privileges
- Message creation and viewing
- Different views for members and non-members

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd members-only
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
SESSION_SECRET=your_session_secret
```

4. Set up the Supabase database:
   - Create a new project in Supabase
   - Run the SQL migrations in the `supabase/migrations` directory
   - Copy the project URL and anon key to your `.env` file

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1. Sign up for an account
2. Log in with your credentials
3. Enter the secret passcode (`secret123`) to join the club
4. Create and view messages
5. Admins can delete messages

## Secret Passcodes

- Club membership: `secret123`
- Admin accounts can be created during signup by checking the "Create Admin Account" checkbox

## License

MIT 