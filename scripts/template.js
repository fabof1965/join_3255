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
        <a href="./board.html">
          <img src="../assets/icons/board.svg" alt="" />
          <span>Board</span>
        </a>
        <a href="">
          <img src="../assets/icons/contacts.svg" alt="" />
          <span>Contacts</span>
        </a>
      </nav>
      <div class="sidebar-footer">
        <a href="./privacy_policy.html">Privacy Policy</a>
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
    <article class="task-card" draggable="true" data-task-id="{{id}}">
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

const taskOverlayTemplate = `
  <article class="task-overlay" role="dialog" aria-modal="true" aria-labelledby="task-overlay-title">
    <header class="task-overlay-header">
      <span class="task-overlay-category {{categoryClass}}">{{category}}</span>
      <button class="task-overlay-close" type="button" aria-label="Close task details">
        <img src="../assets/icons/close-task-overlay.png" alt="" />
      </button>
    </header>
    <h2 id="task-overlay-title">{{title}}</h2>
    <p class="task-overlay-description">{{description}}</p>
    <div class="task-overlay-row"><strong>Due date:</strong><span>{{dueDate}}</span></div>
    <div class="task-overlay-row"><strong>Priority:</strong><span class="task-overlay-priority">{{priorityLabel}}{{priorityIcon}}</span></div>
    <section class="task-overlay-section">
      <h3>Assigned To:</h3>
      <div class="task-overlay-users">{{assignedUsers}}</div>
    </section>
    <section class="task-overlay-section {{subtaskSectionClass}}">
      <h3>Subtasks</h3>
      <div class="task-overlay-subtasks">{{subtasks}}</div>
    </section>
    <footer class="task-overlay-actions">
      <button class="task-overlay-delete" type="button"><img src="../assets/icons/delete-task.png" alt="" />Delete</button>
      <span></span>
      <button type="button"><img src="../assets/icons/edit-task.png" alt="" />Edit</button>
    </footer>
  </article>
`;

const taskOverlayUserTemplate = `
  <div class="task-overlay-user">
    <span class="task-overlay-user-badge">{{initials}}</span>
    <span>{{name}}</span>
  </div>
`;

const taskOverlaySubtaskTemplate = `
  <div class="task-overlay-subtask">
    <img src="../assets/icons/subtask-checked.png" alt="Completed" />
    <span>{{title}}</span>
  </div>
`;

const urgentPriorityTemplate = `<img src="../assets/icons/urgent-priority.png" alt="" />`;

const mediumPriorityTemplate = `<span class="priority-symbol-medium">=</span>`;

const lowPriorityTemplate = `<span class="priority-symbol-low">↓</span>`;

const addTaskTemplate = `
  <section class="add-task-dialog" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
    <header class="add-task-header">
      <h2 id="add-task-title">Add Task</h2>
      <button class="add-task-close" type="button" aria-label="Close add task"><img src="../assets/icons/close-task-overlay.png" alt="" /></button>
    </header>
    <form id="add-task-form" class="add-task-form" novalidate>
      <label class="add-task-field add-task-title-field">
        <span class="visually-hidden">Title</span>
        <input name="title" type="text" placeholder="Enter a title" />
        <small data-error="title"></small>
      </label>
      <label class="add-task-field"><strong>Description <span>(optional)</span></strong>
        <textarea name="description" placeholder="Enter a Description"></textarea>
      </label>
      <label class="add-task-field"><strong>Due date</strong>
        <input name="dueDate" type="date" />
        <small data-error="dueDate"></small>
      </label>
      <fieldset class="add-task-priority"><legend>Priority</legend>
        <button type="button" data-priority="urgent">Urgent</button>
        <button class="selected" type="button" data-priority="medium">Medium</button>
        <button type="button" data-priority="low">Low</button>
      </fieldset>
      <label class="add-task-field"><strong>Assigned to <span>(optional)</span></strong>
        <select name="assignedUsers" multiple>
          <option value="SG">Saeed Ghorbani</option><option value="JB">Jan-Simon Boecker</option><option value="CE">Cem Eren Ölmez</option><option value="FG">Fabian Gerdes</option>
        </select>
      </label>
      <label class="add-task-field"><strong>Category</strong>
        <select name="category"><option value="">Select task category</option><option>User Story</option><option>Technical Task</option></select>
        <small data-error="category"></small>
      </label>
      <label class="add-task-field"><strong>Subtasks <span>(optional)</span></strong>
        <input name="subtask" type="text" placeholder="Add new subtask" />
      </label>
      <ul class="add-task-subtasks"></ul>
      <button class="create-task-button" type="submit">Create Task</button>
    </form>
  </section>
`;

const addTaskSubtaskTemplate = `<li>{{title}}</li>`;
