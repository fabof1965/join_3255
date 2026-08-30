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

const taskCardTemplate = `
    <article class="task-card">
      <span class="task-category {{categoryClass}}">{{category}}</span>
      <div class="task-content">
        <h3>{{title}}</h3>
        <p>{{description}}</p>
      </div>
      {{subtaskProgress}}
      <div class="task-footer">
        <div class="assigned-users">{{assignedUsers}}</div>
        <span class="task-priority task-priority-{{priority}}" aria-label="{{priority}} priority">{{prioritySymbol}}</span>
      </div>
    </article>
`;

const subtaskProgressTemplate = `
    <div class="subtask-progress">
      <div class="progress-track" role="progressbar" aria-valuenow="{{completed}}" aria-valuemin="0" aria-valuemax="{{total}}">
        <div class="progress-fill" style="width: {{progress}}%"></div>
      </div>
      <span>{{completed}}/{{total}} Subtasks</span>
    </div>
`;

const userBadgeTemplate = `<span class="user-badge">{{initials}}</span>`;

const emptyTaskListTemplate = `<p class="empty-task-list">{{text}}</p>`;
