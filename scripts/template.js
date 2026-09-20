const sidebarTemplate = `
    <nav class="sidebar-navigation">
      <section class="page-links">
        <a href="./summary.html">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path class="svg-fill" d="M21 1H3C1.89543 1 1 1.89648 1 3.00105C1 3.02939 1 3.04928 1 3.05917V21.0592C1 22.1311 1.86998 23 2.94187 23C2.97009 23 2.98998 23 2.99999 23H21C21.01 23 21.0299 23 21.0581 23C22.13 23 23 22.1311 23 21.0592V3.05915C23 3.04925 23 3.02937 23 3.00104C23 1.89648 22.1046 1 21 1ZM14 21.0592H3V13.0591H14V21.0592ZM14 11.0591H3V3.05917L14 3.05915V11.0591ZM21 21.0592H16V3.05917H21V21.0592Z" fill="#42526E"/>
          </svg>
          <span>Summary</span>
        </a>
        <a href="../pages/addTask.html">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_78693_284" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect class="svg-fill" width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_78693_284)">
            <path class="svg-fill" transform="translate(1,1) scale(0.9155)" d="M2.34117 24.0149C1.69725 24.0149 1.14601 23.7856 0.68746 23.327C0.228909 22.8685 -0.000366211 22.3173 -0.000366211 21.6733V5.28259C-0.000366211 4.63866 0.228909 4.08743 0.68746 3.62888C1.14601 3.17033 1.69725 2.94105 2.34117 2.94105H12.7903L10.4487 5.28259H2.34117V21.6733H18.7319V13.5365L21.0734 11.195V21.6733C21.0734 22.3173 20.8442 22.8685 20.3856 23.327C19.9271 23.7856 19.3758 24.0149 18.7319 24.0149H2.34117ZM15.4245 3.61424L17.0928 5.25332L9.36577 12.9804V14.6487H11.0048L18.7612 6.89239L20.4295 8.53147L12.6732 16.2878C12.4585 16.5024 12.2098 16.6732 11.9268 16.8C11.6439 16.9268 11.3463 16.9903 11.0341 16.9903H8.19501C7.86329 16.9903 7.58523 16.8781 7.36083 16.6537C7.13644 16.4293 7.02424 16.1512 7.02424 15.8195V12.9804C7.02424 12.6682 7.08278 12.3706 7.19985 12.0877C7.31693 11.8047 7.48279 11.5559 7.69743 11.3413L15.4245 3.61424ZM20.4295 8.53147L15.4245 3.61424L18.3514 0.687324C18.8197 0.219017 19.3807 -0.0151367 20.0344 -0.0151367C20.6881 -0.0151367 21.2393 0.219017 21.6881 0.687324L23.3272 2.35567C23.776 2.80446 24.0004 3.35082 24.0004 3.99474C24.0004 4.63866 23.776 5.18502 23.3272 5.63382L20.4295 8.53147Z" fill="#42526E"/>
            </g>
          </svg>
          <span>Add Task</span>
        </a>
        <a href="../pages/board.html">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(1,1) scale(0.9167)">
            <path class="svg-fill" d="M18.4615 3.69207L18.4615 20.3075C18.461 20.7969 18.2664 21.2662 17.9203 21.6124C17.5742 21.9585 17.1049 22.1531 16.6154 22.1536L12.9231 22.1536C12.4336 22.1531 11.9643 21.9585 11.6182 21.6124C11.2721 21.2662 11.0774 20.7969 11.0769 20.3075L11.0769 3.69207C11.0774 3.20259 11.2721 2.7333 11.6182 2.38719C11.9643 2.04107 12.4336 1.84641 12.9231 1.84592L16.6154 1.84592C17.1049 1.84641 17.5742 2.04107 17.9203 2.38719C18.2664 2.7333 18.461 3.20259 18.4615 3.69207ZM12.9231 20.3075L16.6154 20.3075L16.6154 3.69207L12.9231 3.69207L12.9231 20.3075ZM12.9231 3.69207L12.9231 20.3075C12.9226 20.7969 12.7279 21.2662 12.3818 21.6123C12.0357 21.9584 11.5664 22.1531 11.0769 22.1536L7.38462 22.1536C6.89513 22.1531 6.42584 21.9584 6.07973 21.6123C5.73361 21.2662 5.53895 20.7969 5.53846 20.3074L5.53846 3.69206C5.53895 3.20258 5.73361 2.73328 6.07973 2.38717C6.42584 2.04105 6.89513 1.84639 7.38461 1.8459L11.0769 1.8459C11.5664 1.84639 12.0357 2.04105 12.3818 2.38717C12.7279 2.73328 12.9226 3.20259 12.9231 3.69207ZM7.38462 20.3074L11.0769 20.3075L11.0769 3.69207L7.38461 3.69206L7.38462 20.3074ZM7.38461 3.69206L7.38462 20.3074C7.38413 20.7969 7.18946 21.2662 6.84335 21.6123C6.49723 21.9584 6.02794 22.1531 5.53846 22.1536L1.84615 22.1536C1.35667 22.1531 0.887381 21.9584 0.541266 21.6123C0.195151 21.2662 0.000488688 20.7969 -8.07075e-08 20.3074L-8.06989e-07 3.69206C0.000487919 3.20258 0.19515 2.73328 0.541265 2.38717C0.88738 2.04105 1.35667 1.84639 1.84615 1.8459L5.53846 1.8459C6.02794 1.84639 6.49723 2.04105 6.84335 2.38717C7.18946 2.73328 7.38413 3.20258 7.38461 3.69206ZM1.84615 20.3074L5.53846 20.3074L5.53846 3.69206L1.84615 3.69206L1.84615 20.3074Z" fill="#42526E"/>
            <path class="svg-fill" d="M24 3.69228L24 20.3077C23.9995 20.7971 23.8048 21.2664 23.4587 21.6125C23.1126 21.9587 22.6433 22.1533 22.1538 22.1538L18.4615 22.1538C17.9721 22.1533 17.5028 21.9587 17.1567 21.6125C16.8105 21.2664 16.6159 20.7969 16.6154 20.3075L16.6154 3.69207C16.6159 3.20259 16.8105 2.7335 17.1567 2.38739C17.5028 2.04127 17.9721 1.84661 18.4615 1.84612L22.1538 1.84612C22.6433 1.84661 23.1126 2.04127 23.4587 2.38739C23.8048 2.7335 23.9995 3.2028 24 3.69228ZM18.4615 20.3075L22.1538 20.3077L22.1538 3.69228L18.4615 3.69207L18.4615 20.3075Z" fill="#42526E"/>
            </g>
          </svg>
          <span>Board</span>
        </a>
        <a href="../pages/contacts.html">
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_78693_296" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
            <rect class="svg-fill" width="24" height="24" fill="#D9D9D9"/>
            </mask>
            <g mask="url(#mask0_78693_296)">
            <path class="svg-fill" transform="translate(1,1) scale(0.9167)" d="M12 19.2C10.88 19.2 9.80995 19.375 8.78995 19.725C7.76995 20.075 6.83995 20.6 5.99995 21.3V21.6H18V21.3C17.16 20.6 16.23 20.075 15.21 19.725C14.19 19.375 13.12 19.2 12 19.2ZM3.59995 20.22C4.67995 19.16 5.93495 18.325 7.36495 17.715C8.79495 17.105 10.34 16.8 12 16.8C13.66 16.8 15.205 17.105 16.635 17.715C18.065 18.325 19.32 19.16 20.4 20.22V4.8H3.59995V20.22ZM12 14.4C10.84 14.4 9.84995 13.99 9.02995 13.17C8.20995 12.35 7.79995 11.36 7.79995 10.2C7.79995 9.04 8.20995 8.05 9.02995 7.23C9.84995 6.41 10.84 6 12 6C13.16 6 14.15 6.41 14.97 7.23C15.79 8.05 16.2 9.04 16.2 10.2C16.2 11.36 15.79 12.35 14.97 13.17C14.15 13.99 13.16 14.4 12 14.4ZM12 12C12.5 12 12.925 11.825 13.275 11.475C13.625 11.125 13.8 10.7 13.8 10.2C13.8 9.7 13.625 9.275 13.275 8.925C12.925 8.575 12.5 8.4 12 8.4C11.5 8.4 11.075 8.575 10.725 8.925C10.375 9.275 10.2 9.7 10.2 10.2C10.2 10.7 10.375 11.125 10.725 11.475C11.075 11.825 11.5 12 12 12ZM3.59995 24C2.93995 24 2.37495 23.765 1.90495 23.295C1.43495 22.825 1.19995 22.26 1.19995 21.6V4.8C1.19995 4.14 1.43495 3.575 1.90495 3.105C2.37495 2.635 2.93995 2.4 3.59995 2.4H4.79995V1.2C4.79995 0.537258 5.33721 0 5.99995 0C6.66269 0 7.19995 0.537258 7.19995 1.2V2.4H16.8V1.2C16.8 0.537258 17.3372 0 18 0C18.6627 0 19.2 0.537259 19.2 1.2V2.4H20.4C21.06 2.4 21.625 2.635 22.095 3.105C22.565 3.575 22.8 4.14 22.8 4.8V21.6C22.8 22.26 22.565 22.825 22.095 23.295C21.625 23.765 21.06 24 20.4 24H3.59995Z" fill="#42526E"/>
            </g>
          </svg>
          <span>Contacts</span>
        </a>
      </section>
      <footer class="sidebar-footer">
        <a class="privacy-policy-link" href="./privacy_policy.html">Privacy Policy</a>
        <a class="legal-notice-link" href="./legal_notice.html">Legal Notice</a>
      </footer>
    </nav>
  `;

function getMobileNavigtion() {
  return `
      <nav class="mobile-navigation" aria-label="Main navigation">
        <div class="log-in">
          <img src="../assets/icons/login.svg" alt="log-in-icon">
          <p>Log in</p>
        </div>
        <div class="page-links">
          <a class="privacy-policy-link" href="./privacy_policy.html">Privacy Policy</a>
          <a class="legal-notice-link" href="./legal_notice.html">Legal Notice</a>
        </div>
      </nav>
      `;
}

const headerTemplate = `
  <div class="content-limit">
    <div class="header-left">
      <button class="header-icon-button" type="button" aria-label="Header Logo">
        <img src="../assets/icons/logo-white.svg" alt="Join Logo"/>
      </button>
    </div>
    <div class="header-right">
      <span>Kanban Project Management Tool</span>
      <button class="header-icon-button" type="button" aria-label="Open help">
        <img onclick="toHelpPage()" class="help-icon" src="../assets/icons/help.svg" alt="to help page" />
      </button>
      <button class="header-icon-button" type="button" aria-label="Open user profile">
        <img class="profile-icon" src="../assets/icons/user_profile.svg" alt="" />
      </button>
    </div>
  </div>
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
        <img src="../assets/icons/close-task-overlay.svg" alt="close task" />
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

const addTaskDialogTemplate = `
  <section class="add-task-dialog" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
    <header class="add-task-header">
      <h2 id="add-task-title">Add Task</h2>
      <button class="add-task-close" type="button" aria-label="Close add task"><img src="../assets/icons/close-task-overlay.svg" alt="" /></button>
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
        <button class="btn" type="button" data-priority="urgent">
          <span>Urgent</span>
          <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.9043 14.5096C18.6696 14.51 18.4411 14.4351 18.2522 14.2961L10.0001 8.21288L1.74809 14.2961C1.63224 14.3816 1.50066 14.4435 1.36086 14.4783C1.22106 14.513 1.07577 14.5199 0.933305 14.4986C0.790837 14.4772 0.653973 14.428 0.530528 14.3538C0.407083 14.2796 0.299474 14.1818 0.213845 14.0661C0.128216 13.9503 0.0662437 13.8188 0.0314671 13.6791C-0.00330956 13.5394 -0.0102098 13.3943 0.0111604 13.2519C0.0543195 12.9644 0.21001 12.7058 0.443982 12.533L9.34809 5.96249C9.53679 5.8229 9.76536 5.74756 10.0001 5.74756C10.2349 5.74756 10.4635 5.8229 10.6522 5.96249L19.5563 12.533C19.7422 12.6699 19.8801 12.862 19.9503 13.0819C20.0204 13.3018 20.0193 13.5382 19.9469 13.7573C19.8746 13.9765 19.7349 14.1673 19.5476 14.3024C19.3604 14.4375 19.1352 14.51 18.9043 14.5096Z" fill="#FF3D00"/>
            <path d="M18.9043 8.76057C18.6696 8.76097 18.4411 8.68612 18.2522 8.54702L10.0002 2.46386L1.7481 8.54702C1.51412 8.71983 1.22104 8.79269 0.93331 8.74956C0.645583 8.70643 0.386785 8.55086 0.213849 8.31706C0.0409137 8.08326 -0.0319941 7.79039 0.011165 7.50288C0.054324 7.21536 0.210015 6.95676 0.443986 6.78395L9.3481 0.213471C9.5368 0.0738799 9.76537 -0.00146484 10.0002 -0.00146484C10.2349 -0.00146484 10.4635 0.0738799 10.6522 0.213471L19.5563 6.78395C19.7422 6.92087 19.8801 7.11298 19.9503 7.33286C20.0204 7.55274 20.0193 7.78914 19.947 8.00832C19.8746 8.22751 19.7349 8.41826 19.5476 8.55335C19.3604 8.68844 19.1352 8.76096 18.9043 8.76057Z" fill="#FF3D00"/>
          </svg>
        </button>
        <button class="selected btn" type="button" data-priority="medium">
          <span>Medium</span>
          <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_79630_4973)">
            <path d="M18.9041 7.45086H1.09589C0.805242 7.45086 0.526498 7.33456 0.320979 7.12755C0.11546 6.92054 0 6.63977 0 6.34701C0 6.05425 0.11546 5.77349 0.320979 5.56647C0.526498 5.35946 0.805242 5.24316 1.09589 5.24316H18.9041C19.1948 5.24316 19.4735 5.35946 19.679 5.56647C19.8845 5.77349 20 6.05425 20 6.34701C20 6.63977 19.8845 6.92054 19.679 7.12755C19.4735 7.33456 19.1948 7.45086 18.9041 7.45086Z" fill="white"/>
            <path d="M18.9041 2.2077H1.09589C0.805242 2.2077 0.526498 2.0914 0.320979 1.88439C0.11546 1.67738 0 1.39661 0 1.10385C0 0.81109 0.11546 0.530322 0.320979 0.32331C0.526498 0.116298 0.805242 0 1.09589 0L18.9041 0C19.1948 0 19.4735 0.116298 19.679 0.32331C19.8845 0.530322 20 0.81109 20 1.10385C20 1.39661 19.8845 1.67738 19.679 1.88439C19.4735 2.0914 19.1948 2.2077 18.9041 2.2077Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_79630_4973">
            <rect width="20" height="7.45098" fill="white"/>
            </clipPath>
            </defs>
          </svg>
        </button>
        <button class="btn" type="button" data-priority="low">
          <span>Low</span>
          <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 8.76077C9.7654 8.76118 9.53687 8.68634 9.34802 8.54726L0.444913 1.97752C0.329075 1.89197 0.231235 1.78445 0.15698 1.66111C0.0827245 1.53777 0.033508 1.40102 0.0121402 1.25868C-0.031014 0.971193 0.0418855 0.678356 0.214802 0.444584C0.387718 0.210811 0.646486 0.0552534 0.934181 0.0121312C1.22188 -0.0309911 1.51493 0.0418545 1.74888 0.214643L10 6.29712L18.2511 0.214643C18.367 0.129087 18.4985 0.0671675 18.6383 0.0324205C18.7781 -0.00232646 18.9234 -0.00922079 19.0658 0.0121312C19.2083 0.0334832 19.3451 0.0826633 19.4685 0.156864C19.592 0.231064 19.6996 0.328831 19.7852 0.444584C19.8708 0.560336 19.9328 0.691806 19.9676 0.831488C20.0023 0.97117 20.0092 1.11633 19.9879 1.25868C19.9665 1.40102 19.9173 1.53777 19.843 1.66111C19.7688 1.78445 19.6709 1.89197 19.5551 1.97752L10.652 8.54726C10.4631 8.68634 10.2346 8.76118 10 8.76077Z" fill="#7AE229"/>
            <path d="M10 14.5093C9.7654 14.5097 9.53687 14.4349 9.34802 14.2958L0.444913 7.72606C0.210967 7.55327 0.0552944 7.29469 0.0121402 7.00721C-0.031014 6.71973 0.0418855 6.42689 0.214802 6.19312C0.387718 5.95935 0.646486 5.80379 0.934181 5.76067C1.22188 5.71754 1.51493 5.79039 1.74888 5.96318L10 12.0457L18.2511 5.96318C18.4851 5.79039 18.7781 5.71754 19.0658 5.76067C19.3535 5.80379 19.6123 5.95935 19.7852 6.19312C19.9581 6.42689 20.031 6.71973 19.9879 7.00721C19.9447 7.29469 19.789 7.55327 19.5551 7.72606L10.652 14.2958C10.4631 14.4349 10.2346 14.5097 10 14.5093Z" fill="#7AE229"/>
          </svg>
        </button>
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

const addTaskContentTemplate =
  `<form id="add-task-form" class="add-task-form" novalidate>
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
          <button type="button" data-priority="urgent">
            <span>Urgent</span>
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.9043 14.5096C18.6696 14.51 18.4411 14.4351 18.2522 14.2961L10.0001 8.21288L1.74809 14.2961C1.63224 14.3816 1.50066 14.4435 1.36086 14.4783C1.22106 14.513 1.07577 14.5199 0.933305 14.4986C0.790837 14.4772 0.653973 14.428 0.530528 14.3538C0.407083 14.2796 0.299474 14.1818 0.213845 14.0661C0.128216 13.9503 0.0662437 13.8188 0.0314671 13.6791C-0.00330956 13.5394 -0.0102098 13.3943 0.0111604 13.2519C0.0543195 12.9644 0.21001 12.7058 0.443982 12.533L9.34809 5.96249C9.53679 5.8229 9.76536 5.74756 10.0001 5.74756C10.2349 5.74756 10.4635 5.8229 10.6522 5.96249L19.5563 12.533C19.7422 12.6699 19.8801 12.862 19.9503 13.0819C20.0204 13.3018 20.0193 13.5382 19.9469 13.7573C19.8746 13.9765 19.7349 14.1673 19.5476 14.3024C19.3604 14.4375 19.1352 14.51 18.9043 14.5096Z" fill="#FF3D00"/>
              <path d="M18.9043 8.76057C18.6696 8.76097 18.4411 8.68612 18.2522 8.54702L10.0002 2.46386L1.7481 8.54702C1.51412 8.71983 1.22104 8.79269 0.93331 8.74956C0.645583 8.70643 0.386785 8.55086 0.213849 8.31706C0.0409137 8.08326 -0.0319941 7.79039 0.011165 7.50288C0.054324 7.21536 0.210015 6.95676 0.443986 6.78395L9.3481 0.213471C9.5368 0.0738799 9.76537 -0.00146484 10.0002 -0.00146484C10.2349 -0.00146484 10.4635 0.0738799 10.6522 0.213471L19.5563 6.78395C19.7422 6.92087 19.8801 7.11298 19.9503 7.33286C20.0204 7.55274 20.0193 7.78914 19.947 8.00832C19.8746 8.22751 19.7349 8.41826 19.5476 8.55335C19.3604 8.68844 19.1352 8.76096 18.9043 8.76057Z" fill="#FF3D00"/>
            </svg>
          </button>
          <button class="selected" type="button" data-priority="medium">
            <span>Medium</span>
            <svg width="20" height="8" viewBox="0 0 20 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_79630_4973)">
              <path d="M18.9041 7.45086H1.09589C0.805242 7.45086 0.526498 7.33456 0.320979 7.12755C0.11546 6.92054 0 6.63977 0 6.34701C0 6.05425 0.11546 5.77349 0.320979 5.56647C0.526498 5.35946 0.805242 5.24316 1.09589 5.24316H18.9041C19.1948 5.24316 19.4735 5.35946 19.679 5.56647C19.8845 5.77349 20 6.05425 20 6.34701C20 6.63977 19.8845 6.92054 19.679 7.12755C19.4735 7.33456 19.1948 7.45086 18.9041 7.45086Z" fill="white"/>
              <path d="M18.9041 2.2077H1.09589C0.805242 2.2077 0.526498 2.0914 0.320979 1.88439C0.11546 1.67738 0 1.39661 0 1.10385C0 0.81109 0.11546 0.530322 0.320979 0.32331C0.526498 0.116298 0.805242 0 1.09589 0L18.9041 0C19.1948 0 19.4735 0.116298 19.679 0.32331C19.8845 0.530322 20 0.81109 20 1.10385C20 1.39661 19.8845 1.67738 19.679 1.88439C19.4735 2.0914 19.1948 2.2077 18.9041 2.2077Z" fill="white"/>
              </g>
              <defs>
              <clipPath id="clip0_79630_4973">
              <rect width="20" height="7.45098" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </button>
          <button type="button" data-priority="low">
            <span>Low</span>
            <svg width="20" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 8.76077C9.7654 8.76118 9.53687 8.68634 9.34802 8.54726L0.444913 1.97752C0.329075 1.89197 0.231235 1.78445 0.15698 1.66111C0.0827245 1.53777 0.033508 1.40102 0.0121402 1.25868C-0.031014 0.971193 0.0418855 0.678356 0.214802 0.444584C0.387718 0.210811 0.646486 0.0552534 0.934181 0.0121312C1.22188 -0.0309911 1.51493 0.0418545 1.74888 0.214643L10 6.29712L18.2511 0.214643C18.367 0.129087 18.4985 0.0671675 18.6383 0.0324205C18.7781 -0.00232646 18.9234 -0.00922079 19.0658 0.0121312C19.2083 0.0334832 19.3451 0.0826633 19.4685 0.156864C19.592 0.231064 19.6996 0.328831 19.7852 0.444584C19.8708 0.560336 19.9328 0.691806 19.9676 0.831488C20.0023 0.97117 20.0092 1.11633 19.9879 1.25868C19.9665 1.40102 19.9173 1.53777 19.843 1.66111C19.7688 1.78445 19.6709 1.89197 19.5551 1.97752L10.652 8.54726C10.4631 8.68634 10.2346 8.76118 10 8.76077Z" fill="#7AE229"/>
              <path d="M10 14.5093C9.7654 14.5097 9.53687 14.4349 9.34802 14.2958L0.444913 7.72606C0.210967 7.55327 0.0552944 7.29469 0.0121402 7.00721C-0.031014 6.71973 0.0418855 6.42689 0.214802 6.19312C0.387718 5.95935 0.646486 5.80379 0.934181 5.76067C1.22188 5.71754 1.51493 5.79039 1.74888 5.96318L10 12.0457L18.2511 5.96318C18.4851 5.79039 18.7781 5.71754 19.0658 5.76067C19.3535 5.80379 19.6123 5.95935 19.7852 6.19312C19.9581 6.42689 20.031 6.71973 19.9879 7.00721C19.9447 7.29469 19.789 7.55327 19.5551 7.72606L10.652 14.2958C10.4631 14.4349 10.2346 14.5097 10 14.5093Z" fill="#7AE229"/>
            </svg>
          </button>
        </div>
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
    </form>`
  ;
const addTaskSubtaskTemplate = `<li>{{title}}</li>`;

function getInputFieldsForLogin() {
  return `<div class="input-wrapper">
                <div class="input-content-container">
                  <label for="email" class="visually-hidden">Email</label>
                  <input id="email" class="input-field" type="email" placeholder="Email" required />
                  <img src="./assets/icons/mail.svg" alt="mail icon" />
                </div>
            </div>
            <div class="input-wrapper">
                <div class="input-content-container" id="error-msg-border-bottom">
                  <label for="login-password" class="visually-hidden">Passwort</label>
                  <input id="login-password" class="input-field" type="password" placeholder="Passwort" required />
                  <img id="login-password-toggle-icon" class="lock-img"
                      src="./assets/icons/lock.svg" alt="lock icon" />
                </div>
            <span id="error-msg" class="error-msg visibility-hidden">Check your email and password. Please try again.</span>
            </div>
            `;
}

function getInputFieldsForSignup() {
  return `<div class="input-wrapper">
              <div class="input-content-container">  
                <input class="input-field" type="text" id="name" placeholder="Name" autocomplete="name" required>
                <img src="./assets/icons/person.svg" alt="person logo">
              </div>
              <span class="error-msg visibility-hidden"></span>
            </div>

            <div class="input-wrapper">
                <div class="input-content-container" id="invalid-email-border-bottom">
                  <input class="input-field" type="email" id="email-signup" placeholder="Email" required>
                  <img src="./assets/icons/mail.svg" alt="mail logo">
                </div>
                <span id="invalid-email-msg" class="error-msg visibility-hidden">user already exists</span>
            </div>

            <div class="input-wrapper">
              <div class="input-content-container">
                <input class="input-field" type="password" id="sign-up-password" required placeholder="Password">
                <img id="sign-up-password-toggle-icon" class="lock-img" src="./assets/icons/lock.svg" alt="lock-img">
              </div>
              <span class="error-msg visibility-hidden"></span>
            </div>

            <div class="input-wrapper" >
                <div class="input-content-container" id="confirm-password-border-bottom">
                  <input class="input-field" type="password" id="confirm-password" required placeholder="Confirm Password">
                  <img id="confirm-password-toggle-icon" class="lock-img" src="./assets/icons/lock.svg" alt="lock logo">
                </div>
                <span id="invalid-pw-confirm-msg" class="error-msg visibility-hidden">passwords do not match</span>
            </div>
            `;
}

function getContactTemplate(i) {
  return `
      <div class="contact-card" id="contact-card${i}" onclick="toggleBackgroundColor(this, ${i})">
        <div class="profile-badge">${renderProfileBadges(allContacts[i].name).toUpperCase()}</div>
        <div class="name-and-mail">
          <span class="name">${allContacts[i].name}</span>
          <span class="mail">${allContacts[i].email}</span>
        </div>
      </div>
  `;
}

function getFirstLetterTemplate(firstLetter) {
  return `
      <div class="letter">${firstLetter}</div>
      <div class="seperator"></div>
    `;
}

function getContactInformationTemplate(i) {
  return`
                  <header class="detail-header">
                    <div class="header-content-1">
                        <div class="profile-badge-large large-text">
                            <span class="profile-badge-text" id="initials-detail">${renderProfileBadges(allContacts[i].name).toUpperCase()}</span>
                        </div>
                        <div class="name-edit-delete">
                            <h2 class="name large-text" id="name-detail">${allContacts[i].name}</h2>
                            <div class="edit-delete" id="edit-delete-detail">
                                <button class="edit" onclick="editExistingContact()">
                                    <img src="../assets/icons/edit.svg" alt="Edit contact">Edit
                                </button>
                                <button onclick="deleteContact(${i})" class="delete">
                                    <img src="../assets/icons/delete.svg" alt="Delete contact">Delete
                                </button>    
                            </div>
                        </div>
                    </div>
                    <div class="header-content-2">
                        <div class="contact-info-headline-container">
                            <h3 class="info-headline">
                                <span>Contact Information</span>
                            </h3>
                            <button onclick="toggleBackgroundColor(document.getElementById(contact-card${i}))" class="arrow-btn">
                                <img src="../assets/icons/arrow-left-line.png" alt="back-to-contacts">
                            </button>
                        </div>
                    </div>
                </header>
                <div class="contact-information">
                    <section class="email">
                        <h4>E-Mail</h4>
                        <span id="mail-detail" class="email-text">${allContacts[i].email}</span>
                    </section>
                    <section class="phone">
                        <h4>Phone</h4>
                        <span id="phone-detail">${allContacts[i].phone}</span>
                    </section>
                </div>
  `;
}