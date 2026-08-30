const sidebarTemplate = `
  <aside class="sidebar">
      <nav class="sidebar-navigation">
        <a href="./summary.html">
          <img src="../assets/icons/summary.svg" alt="" />
          <span>Summary</span>
        </a>
        <a href="">
          <img src="../assets/icons/add_task.svg" alt="" />
          <span>Add Task</span>
        </a>
        <a href="">
          <img src="../assets/icons/board.svg" alt="" />
          <span>Board</span>
        </a>
        <a href="">
          <img src="../assets/icons/contacts.svg" alt="" />
          <span>Contacts</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <a href="#">Privacy Policy</a>
        <a href="#">Legal Notice</a>
      </div>
    </aside>
  `;

const headerTemplate = `
  <header class="header">
      <div class="header-left">
        <button class="header-icon-button" type="button" aria-label="Header Logo">
          <img src="../assets/icons/logo-white.svg" alt="Join Logo"/>
        </button>
      </div>
      <div class="header-right">
        <span>Kanban Project Management Tool</span>
        <button class="header-icon-button" type="button" aria-label="Open help">
          <img class="help-icon" src="../assets/icons/help.svg" alt="" />
        </button>
        <button class="header-icon-button" type="button" aria-label="Open user profile">
          <img class="profile-icon" src="../assets/icons/user_profile.svg" alt="" />
        </button>
      </div>
    </header>
`;
