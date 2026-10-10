const taskCardTemplate = `
    <article class="task-card" role="button" tabindex="0" aria-label="Open task {{title}}" draggable="true" data-task-id="{{id}}">
      <div class="task-card-header">
        <span class="task-category {{categoryClass}}">{{category}}</span>
        <span class="task-card-drag-icon" aria-hidden="true">↕</span>
      </div>
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
      <span id="subtaskcontainer">{{completed}}/{{total}} Subtasks</span>
    </div>
`;

const userBadgeTemplate = `<span class="profile-badge">{{initials}}</span>`;

const emptyTaskListTemplate = `<p class="empty-task-list">{{text}}</p>`;

const taskOverlayTemplate = `
  <article class="task-overlay" role="dialog" aria-modal="true" aria-labelledby="task-overlay-title">
    <header class="task-overlay-header">
      <span class="task-overlay-category {{categoryClass}}">{{category}}</span>
      <button class="close-btn task-overlay-close" type="button" aria-label="Close task details">
        <img class="close-icon" src="../assets/icons/close-task-overlay.svg" alt="close task" />
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
      <button class="task-overlay-delete" type="button"><img src="../assets/icons/delete.svg" alt="delete task" />Delete</button>
      <span></span>
      <button class="task-overlay-edit" type="button"><img src="../assets/icons/edit.svg" alt="edit task" />Edit</button>
    </footer>
  </article>
`;

const taskOverlayUserTemplate = `
  <div class="task-overlay-user">
    <span class="profile-badge">{{initials}}</span>
    <span>{{name}}</span>
  </div>
`;

const taskOverlaySubtaskTemplate = `
  <div class="task-overlay-subtask" data-subtask-index="{{index}}">
    <input class="subtask-checkbox" type="checkbox" id="subtask-{{id}}" {{checked}} />
    <span>{{title}}</span>
  </div>
`;

const urgentPriorityTemplate = `<img src="../assets/icons/urgency_high.svg" alt="" />`;

const mediumPriorityTemplate = `<img src="../assets/icons/urgency_medium.svg" alt=""/>`;

const lowPriorityTemplate = `<img src="../assets/icons/urgency_low.svg" alt=""/>`;

const addTaskDialogTemplate = `
  <section class="add-task-dialog" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
    <header class="add-task-header">
      <h2 id="add-task-title">Add Task</h2>
      <button class="add-task-close close-icon" type="button" aria-label="Close add task"><img src="../assets/icons/close-task-overlay.svg" alt="" /></button>
    </header>
    <form id="add-task-form" class="add-task-form-dialog" novalidate>
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
        <button class="btn" type="button" data-priority="urgent">
          <span>Urgent</span>
          <svg class="urgent-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
            <path class="urgent-svg" d="M18.9043 14.5096C18.6696 14.51 18.4411 14.4351 18.2522 14.2961L10.0001 8.21288L1.74809 14.2961C1.63224 14.3816 1.50066 14.4435 1.36086 14.4783C1.22106 14.513 1.07577 14.5199 0.933305 14.4986C0.790837 14.4772 0.653973 14.428 0.530528 14.3538C0.407083 14.2796 0.299474 14.1818 0.213845 14.0661C0.128216 13.9503 0.0662437 13.8188 0.0314671 13.6791C-0.00330956 13.5394 -0.0102098 13.3943 0.0111604 13.2519C0.0543195 12.9644 0.21001 12.7058 0.443982 12.533L9.34809 5.96249C9.53679 5.8229 9.76536 5.74756 10.0001 5.74756C10.2349 5.74756 10.4635 5.8229 10.6522 5.96249L19.5563 12.533C19.7422 12.6699 19.8801 12.862 19.9503 13.0819C20.0204 13.3018 20.0193 13.5382 19.9469 13.7573C19.8746 13.9765 19.7349 14.1673 19.5476 14.3024C19.3604 14.4375 19.1352 14.51 18.9043 14.5096Z" fill=""/>
            <path class="urgent-svg" d="M18.9043 8.76057C18.6696 8.76097 18.4411 8.68612 18.2522 8.54702L10.0002 2.46386L1.7481 8.54702C1.51412 8.71983 1.22104 8.79269 0.93331 8.74956C0.645583 8.70643 0.386785 8.55086 0.213849 8.31706C0.0409137 8.08326 -0.0319941 7.79039 0.011165 7.50288C0.054324 7.21536 0.210015 6.95676 0.443986 6.78395L9.3481 0.213471C9.5368 0.0738799 9.76537 -0.00146484 10.0002 -0.00146484C10.2349 -0.00146484 10.4635 0.0738799 10.6522 0.213471L19.5563 6.78395C19.7422 6.92087 19.8801 7.11298 19.9503 7.33286C20.0204 7.55274 20.0193 7.78914 19.947 8.00832C19.8746 8.22751 19.7349 8.41826 19.5476 8.55335C19.3604 8.68844 19.1352 8.76096 18.9043 8.76057Z" fill=""/>
          </svg>
        </button>
        <button class="selected btn" type="button" data-priority="medium">
          <span>Medium</span>
          <svg class="medium-svg" width="20" height="8" viewBox="0 0 20 8" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_79630_4973)">
            <path class="medium-svg" d="M18.9041 7.45086H1.09589C0.805242 7.45086 0.526498 7.33456 0.320979 7.12755C0.11546 6.92054 0 6.63977 0 6.34701C0 6.05425 0.11546 5.77349 0.320979 5.56647C0.526498 5.35946 0.805242 5.24316 1.09589 5.24316H18.9041C19.1948 5.24316 19.4735 5.35946 19.679 5.56647C19.8845 5.77349 20 6.05425 20 6.34701C20 6.63977 19.8845 6.92054 19.679 7.12755C19.4735 7.33456 19.1948 7.45086 18.9041 7.45086Z" fill=""/>
            <path class="medium-svg" d="M18.9041 2.2077H1.09589C0.805242 2.2077 0.526498 2.0914 0.320979 1.88439C0.11546 1.67738 0 1.39661 0 1.10385C0 0.81109 0.11546 0.530322 0.320979 0.32331C0.526498 0.116298 0.805242 0 1.09589 0L18.9041 0C19.1948 0 19.4735 0.116298 19.679 0.32331C19.8845 0.530322 20 0.81109 20 1.10385C20 1.39661 19.8845 1.67738 19.679 1.88439C19.4735 2.0914 19.1948 2.2077 18.9041 2.2077Z" fill=""/>
            </g>
            <defs>
            <clipPath id="clip0_79630_4973">
            <rect class="medium-svg" width="20" height="7.45098" fill=""/>
            </clipPath>
            </defs>
          </svg>
        </button>
        <button class="btn" type="button" data-priority="low">
          <span>Low</span>
          <svg class="low-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
            <path class="low-svg" d="M10 8.76077C9.7654 8.76118 9.53687 8.68634 9.34802 8.54726L0.444913 1.97752C0.329075 1.89197 0.231235 1.78445 0.15698 1.66111C0.0827245 1.53777 0.033508 1.40102 0.0121402 1.25868C-0.031014 0.971193 0.0418855 0.678356 0.214802 0.444584C0.387718 0.210811 0.646486 0.0552534 0.934181 0.0121312C1.22188 -0.0309911 1.51493 0.0418545 1.74888 0.214643L10 6.29712L18.2511 0.214643C18.367 0.129087 18.4985 0.0671675 18.6383 0.0324205C18.7781 -0.00232646 18.9234 -0.00922079 19.0658 0.0121312C19.2083 0.0334832 19.3451 0.0826633 19.4685 0.156864C19.592 0.231064 19.6996 0.328831 19.7852 0.444584C19.8708 0.560336 19.9328 0.691806 19.9676 0.831488C20.0023 0.97117 20.0092 1.11633 19.9879 1.25868C19.9665 1.40102 19.9173 1.53777 19.843 1.66111C19.7688 1.78445 19.6709 1.89197 19.5551 1.97752L10.652 8.54726C10.4631 8.68634 10.2346 8.76118 10 8.76077Z" fill=""/>
            <path class="low-svg" d="M10 14.5093C9.7654 14.5097 9.53687 14.4349 9.34802 14.2958L0.444913 7.72606C0.210967 7.55327 0.0552944 7.29469 0.0121402 7.00721C-0.031014 6.71973 0.0418855 6.42689 0.214802 6.19312C0.387718 5.95935 0.646486 5.80379 0.934181 5.76067C1.22188 5.71754 1.51493 5.79039 1.74888 5.96318L10 12.0457L18.2511 5.96318C18.4851 5.79039 18.7781 5.71754 19.0658 5.76067C19.3535 5.80379 19.6123 5.95935 19.7852 6.19312C19.9581 6.42689 20.031 6.71973 19.9879 7.00721C19.9447 7.29469 19.789 7.55327 19.5551 7.72606L10.652 14.2958C10.4631 14.4349 10.2346 14.5097 10 14.5093Z" fill=""/>
          </svg>
        </button>
      </fieldset>
      <label class="add-task-field"><strong>Assigned to <span>(optional)</span></strong>
        <select id="assigned-contacts" name="assignedUsers" multiple></select>
      </label>
      <label class="add-task-field"><strong>Category</strong>
        <select name="category"><option value="">Select task category</option><option>User Story</option><option>Technical Task</option></select>
        <small data-error="category"></small>
      </label>
      <label class="add-task-field"><strong>Subtasks <span>(optional)</span></strong>
        <input class="subtask-input-field" name="subtask" type="text" placeholder="Add new subtask" />
      </label>
      <ul class="add-task-subtasks"></ul>
      <button class="create-task-button btn" type="submit">Create Task</button>
    </form>
  </section>
`;

const addTaskContentTemplate =
  `<form id="add-task-form" class="add-task-form" novalidate>
    <section class="form-content">
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
      <fieldset class="add-task-priority">
        <legend>
          Priority
        </legend>
        <div class="priority-buttons">
          <button class="btn" type="button" data-priority="urgent">
            <span>Urgent</span>
            <svg class="urgent-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
              <path class="urgent-svg" d="M18.9043 14.5096C18.6696 14.51 18.4411 14.4351 18.2522 14.2961L10.0001 8.21288L1.74809 14.2961C1.63224 14.3816 1.50066 14.4435 1.36086 14.4783C1.22106 14.513 1.07577 14.5199 0.933305 14.4986C0.790837 14.4772 0.653973 14.428 0.530528 14.3538C0.407083 14.2796 0.299474 14.1818 0.213845 14.0661C0.128216 13.9503 0.0662437 13.8188 0.0314671 13.6791C-0.00330956 13.5394 -0.0102098 13.3943 0.0111604 13.2519C0.0543195 12.9644 0.21001 12.7058 0.443982 12.533L9.34809 5.96249C9.53679 5.8229 9.76536 5.74756 10.0001 5.74756C10.2349 5.74756 10.4635 5.8229 10.6522 5.96249L19.5563 12.533C19.7422 12.6699 19.8801 12.862 19.9503 13.0819C20.0204 13.3018 20.0193 13.5382 19.9469 13.7573C19.8746 13.9765 19.7349 14.1673 19.5476 14.3024C19.3604 14.4375 19.1352 14.51 18.9043 14.5096Z" fill=""/>
              <path class="urgent-svg" d="M18.9043 8.76057C18.6696 8.76097 18.4411 8.68612 18.2522 8.54702L10.0002 2.46386L1.7481 8.54702C1.51412 8.71983 1.22104 8.79269 0.93331 8.74956C0.645583 8.70643 0.386785 8.55086 0.213849 8.31706C0.0409137 8.08326 -0.0319941 7.79039 0.011165 7.50288C0.054324 7.21536 0.210015 6.95676 0.443986 6.78395L9.3481 0.213471C9.5368 0.0738799 9.76537 -0.00146484 10.0002 -0.00146484C10.2349 -0.00146484 10.4635 0.0738799 10.6522 0.213471L19.5563 6.78395C19.7422 6.92087 19.8801 7.11298 19.9503 7.33286C20.0204 7.55274 20.0193 7.78914 19.947 8.00832C19.8746 8.22751 19.7349 8.41826 19.5476 8.55335C19.3604 8.68844 19.1352 8.76096 18.9043 8.76057Z" fill=""/>
            </svg>
          </button>
          <button class="selected btn" type="button" data-priority="medium">
            <span>Medium</span>
            <svg class="medium-svg" width="20" height="8" viewBox="0 0 20 8" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_79630_4973)">
              <path class="medium-svg" d="M18.9041 7.45086H1.09589C0.805242 7.45086 0.526498 7.33456 0.320979 7.12755C0.11546 6.92054 0 6.63977 0 6.34701C0 6.05425 0.11546 5.77349 0.320979 5.56647C0.526498 5.35946 0.805242 5.24316 1.09589 5.24316H18.9041C19.1948 5.24316 19.4735 5.35946 19.679 5.56647C19.8845 5.77349 20 6.05425 20 6.34701C20 6.63977 19.8845 6.92054 19.679 7.12755C19.4735 7.33456 19.1948 7.45086 18.9041 7.45086Z" fill=""/>
              <path class="medium-svg" d="M18.9041 2.2077H1.09589C0.805242 2.2077 0.526498 2.0914 0.320979 1.88439C0.11546 1.67738 0 1.39661 0 1.10385C0 0.81109 0.11546 0.530322 0.320979 0.32331C0.526498 0.116298 0.805242 0 1.09589 0L18.9041 0C19.1948 0 19.4735 0.116298 19.679 0.32331C19.8845 0.530322 20 0.81109 20 1.10385C20 1.39661 19.8845 1.67738 19.679 1.88439C19.4735 2.0914 19.1948 2.2077 18.9041 2.2077Z" fill=""/>
              </g>
              <defs>
              <clipPath id="clip0_79630_4973">
              <rect class="medium-svg" width="20" height="7.45098" fill=""/>
              </clipPath>
              </defs>
            </svg>
          </button>
          <button class="btn" type="button" data-priority="low">
            <span>Low</span>
            <svg class="low-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
              <path class="low-svg" d="M10 8.76077C9.7654 8.76118 9.53687 8.68634 9.34802 8.54726L0.444913 1.97752C0.329075 1.89197 0.231235 1.78445 0.15698 1.66111C0.0827245 1.53777 0.033508 1.40102 0.0121402 1.25868C-0.031014 0.971193 0.0418855 0.678356 0.214802 0.444584C0.387718 0.210811 0.646486 0.0552534 0.934181 0.0121312C1.22188 -0.0309911 1.51493 0.0418545 1.74888 0.214643L10 6.29712L18.2511 0.214643C18.367 0.129087 18.4985 0.0671675 18.6383 0.0324205C18.7781 -0.00232646 18.9234 -0.00922079 19.0658 0.0121312C19.2083 0.0334832 19.3451 0.0826633 19.4685 0.156864C19.592 0.231064 19.6996 0.328831 19.7852 0.444584C19.8708 0.560336 19.9328 0.691806 19.9676 0.831488C20.0023 0.97117 20.0092 1.11633 19.9879 1.25868C19.9665 1.40102 19.9173 1.53777 19.843 1.66111C19.7688 1.78445 19.6709 1.89197 19.5551 1.97752L10.652 8.54726C10.4631 8.68634 10.2346 8.76118 10 8.76077Z" fill=""/>
              <path class="low-svg" d="M10 14.5093C9.7654 14.5097 9.53687 14.4349 9.34802 14.2958L0.444913 7.72606C0.210967 7.55327 0.0552944 7.29469 0.0121402 7.00721C-0.031014 6.71973 0.0418855 6.42689 0.214802 6.19312C0.387718 5.95935 0.646486 5.80379 0.934181 5.76067C1.22188 5.71754 1.51493 5.79039 1.74888 5.96318L10 12.0457L18.2511 5.96318C18.4851 5.79039 18.7781 5.71754 19.0658 5.76067C19.3535 5.80379 19.6123 5.95935 19.7852 6.19312C19.9581 6.42689 20.031 6.71973 19.9879 7.00721C19.9447 7.29469 19.789 7.55327 19.5551 7.72606L10.652 14.2958C10.4631 14.4349 10.2346 14.5097 10 14.5093Z" fill=""/>
            </svg>
          </button>
        </div>
      </fieldset>
      <label class="add-task-field"><strong>Assigned to <span>(optional)</span></strong>
        <select id="assigned-contacts" name="assignedUsers" multiple></select>
      </label>
      <label class="add-task-field"><strong>Category</strong>
        <select name="category"><option value="">Select task category</option><option>User Story</option><option>Technical Task</option></select>
        <small data-error="category"></small>
      </label>
      <label class="add-task-field"><strong>Subtasks <span>(optional)</span></strong>
        <input name="subtask" type="text" placeholder="Add new subtask" />
      </label>
    </section>
    <section class="form-buttons">
      <button onclick="resetForm()" type="button" class="btn-clear btn">
          <span>
              Clear
          </span>
          <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path class="btn-svg-color" d="M8 8L24 24M24 8L8 24" stroke-width="2" stroke-linecap="round"/>
          </svg>
      </button>
      <button type="submit" class="btn-create-task btn">
          <span>
              Create Task
          </span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_79063_3308" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_79063_3308)">
              <path d="M9.55002 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81669 17.6 9.55002 17.6C9.28336 17.6 9.05002 17.5 8.85002 17.3L4.55002 13C4.35002 12.8 4.25419 12.5625 4.26252 12.2875C4.27086 12.0125 4.37502 11.775 4.57502 11.575C4.77502 11.375 5.01252 11.275 5.28752 11.275C5.56252 11.275 5.80002 11.375 6.00002 11.575L9.55002 15.15Z" fill="white"/>
              </g>
          </svg>
      </button>
    </section>
  </form>`
  ;

const addTaskSubtaskTemplate = `
  <li class="subtask-list" data-index="{{index}}">
    <div class="subtask-wrapper">
      <span>{{title}}</span>
      <div>
        <button type="button" class="subtask-btn" data-action="edit"><img src="../assets/icons/edit.svg" alt="edit subtask"></button>
        <button type="button" class="subtask-btn" data-action="delete"><img src="../assets/icons/delete.svg" alt="delete subtask"></button>
      </div>
    </div>
  </li>`;

const editSubtaskTemplate = `
  <input class="subtask-edit-input" name="subtask-edit" value="{{title}}" />`;

const assignedContactOptionTemplate = `<option value="{{initials}}">{{name}}</option>`;


