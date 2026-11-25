# Join

Join is a Kanban-style task management web app. Users can sign up, log in (or use a guest login), manage tasks on a board with drag and drop, and maintain a contact list. Built as a group project at the Developer Akademie.

**Live demo:** http://join-3255.developerakademie.net/join_3255/index.html

## Features

- **Authentication:** sign up, log in and anonymous guest login (Firebase Authentication)
- **Summary:** overview of task counts per status, upcoming urgent deadline and a dynamic greeting
- **Board:** four columns with drag and drop to change task status, plus search by title and description
- **Tasks:** create, edit and delete tasks with priority (urgent / medium / low), category (*Technical Task* / *User Story*), assigned contacts and subtasks
- **Contacts:** add, edit and delete contacts
- **Help, Legal Notice and Privacy Policy** pages
- **Responsive design** with a rotation warning on mobile devices

## Tech Stack

- HTML, CSS, JavaScript (vanilla, no framework)
- Firebase Authentication and Firebase Realtime Database (accessed via REST)
- GitHub Actions for deployment via FTP

## Project Structure

```
join_3255/
├── index.html          # Login page
├── script.js           # Shared scripts
├── style.css           # Shared styles
├── pages/              # summary, board, addTask, contacts, help, legal notice, privacy policy
├── scripts/            # JavaScript modules (login, signup, board, contacts, firebase, ...)
├── styles/             # CSS files per page/component
├── assets/             # fonts, icons, images
└── .github/workflows/  # FTP deployment
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/fabof1965/join_3255.git
   ```
2. Open the project folder in your editor.
3. Start `index.html` with a local server (e.g. the VS Code *Live Server* extension). The Firebase modules are loaded as ES modules, so opening the file directly via `file://` will not work.

## Deployment

Every push to `main` triggers the workflow in `.github/workflows/ftp_deploy.yml`, which uploads the project to an FTP server. The credentials are stored as GitHub secrets (`FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`).

## Team

Jan-Simon Boecker (Janse309), Fabian Gerdes (fabof1965), Saeed Ghorbani (ghorbani-saeed) and Cem Ölmez (lilascheinabc/cemerenswe)

