# Start Goo Resident

Press **F5** in this workspace to run the real website and backend at http://127.0.0.1:4180.

On the first run, open the **Private setup** link in VS Code's terminal and set your administrator password yourself. Your office email is **joshik.natarajan@gmail.com**. There are no default passwords or demo login buttons.

Then use the office dashboard to set the community name, create resident accounts, add charges, publish events, manage maintenance and issue violations. Account activation links work but must be delivered privately by the office; no email is automatically sent.

Your database is saved under `live/data/`, excluded from Git. The resident directory starts empty; only the 100 apartment slots exist. Individual resident accounts are added by your office.

The iPhone and Android application code is under `mobile/`. Both bundles compiled, but phone installation/publication requires a shared HTTPS backend and signed builds. See `mobile/README.md`.

Payment collection, automated email and app-store distribution are not connected. The current live Sites URL is still the old prototype; this version runs locally; uploading its source to GitHub does not deploy the backend.

Read README.md for the implemented features, tests, and remaining rollout work.
