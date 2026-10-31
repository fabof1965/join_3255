function getTaskCardTemplate(task) {
  return `<article id="${task.id}" class="task-card" role="button" tabindex="0" aria-label="Open task ${task.title}" draggable="true" data-task-id="${task.id}">
            ${getTaskCardContentTemplate(task)}
          </article>`;
}

function getTaskCardContentTemplate(task) {
  return `<header class="task-card-header">
            <span class="task-category ${getCategoryClass(task.category)}">${task.category}</span>
            <span class="task-card-drag-icon" aria-hidden="true">↕</span>
          </header>
          <div class="task-content">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
          </div>
          ${getSubtaskDataProgressHtml(task.subtasks, task.id)}
          <footer class="task-footer">
            <div class="assigned-users">${getUserInitials(task.assignedContacts)}</div>
            <span class="task-priority task-priority-${task.priority}" aria-label="${task.priority} priority">${getPrioritySymbol(task.priority)}</span>
          </footer>`;
}

function getSubtaskProgressTemplate(completed, progress, total, taskId) {
  return `<div class="subtask-progress">
            <div class="progress-track" role="progressbar" aria-valuenow="${completed}" aria-valuemin="0" aria-valuemax="${total}">
              <div class="progress-fill" id="progress-fill-${taskId}" style="width: ${progress}%"></div>
            </div>
            <span id="subtaskcontainer-${taskId}">${completed} / ${total} Subtasks</span>
          </div>`;
}

function getUserBadgeTemplate(initials) {
  return `<span class="profile-badge">${initials}</span>`;
}

function getEmptyTakListElement(emptyTaskListMessage) {
  return `<p class="empty-task-list">${emptyTaskListMessage}</p>`;
}

function getTaskOverlayTemplate(task, priority, subtasksHTML) {
  const subtaskOutput =
    subtasksHTML === ""
      ? `<span class="no-subtasks">No Subtasks</span>`
      : subtasksHTML;

  return `<article class="task-card-dialog-content" role="dialog" aria-modal="true" aria-labelledby="task-card-dialog-title">
            <header class="task-card-dialog-header">
              <span class="task-card-dialog-category ${getCategoryClass(task.category)}">${task.category}</span>
              <button class="close-btn task-card-dialog-close" type="button" aria-label="Close task details">
                <img class="close-icon" src="../assets/icons/close-task-overlay.svg" alt="close task" />
              </button>
            </header>
            <h2 id="task-card-dialog-title">${task.title}</h2>
            <p class="task-card-description">${task.description}</p>
            <div class="task-card-dialog-row">
              <strong>Due date:</strong>
              <span>${task.dueDate}</span>
            </div>
            <div class="task-card-dialog-row">
              <strong>Priority:</strong>
              <span class="task-overlay-priority">${capitalize(priority || "medium")}${getOverlayPriorityIcon(priority || "medium")}</span>
            </div>
            <section class="task-card-dialog-section">
              <h3>Assigned To:</h3>
              <div class="task-card-dialog-users">${getOverlayUsersHtml(task)}</div>
            </section>
            <section class="task-card-dialog-section">
              <h3>Subtasks</h3>
              <div class="task-card-dialog-subtasks">${subtaskOutput}</div>
            </section>
            <footer class="task-card-dialog-buttons">
              <button id="delete-task-card" class="btn-delete-task-card" type="button">
                <img src="../assets/icons/delete.svg" alt="" />Delete
              </button>
              <span></span>
              <button class="btn-edit-task" type="button">
                <img src="../assets/icons/edit.svg" alt="edit task" />Edit
              </button>
            </footer>
          </article>`;
}

function getTaskOverlayUserTemplate(initials, name) {
  return `<div class="task-card-dialog-user">
            <span class="profile-badge">${initials}</span>
            <span>${name}</span>
          </div>`;
}

function getSubtaskTemplate(subtask, checked, taskId, index) {
  return `<div class="task-card-dialog-subtask">
            <input class="subtask-checkbox" type="checkbox" data-index-number="${index}" checked="${checked}"/>
            <span id="subtask-title-${taskId}-${index}">${subtask.title}</span>
          </div>`;
}

const urgentPriorityTemplate =
  `<svg class="urgent-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
    <path class="urgent-svg" d="M18.9043 14.5096C18.6696 14.51 18.4411 14.4351 18.2522 14.2961L10.0001 8.21288L1.74809 14.2961C1.63224 14.3816 1.50066 14.4435 1.36086 14.4783C1.22106 14.513 1.07577 14.5199 0.933305 14.4986C0.790837 14.4772 0.653973 14.428 0.530528 14.3538C0.407083 14.2796 0.299474 14.1818 0.213845 14.0661C0.128216 13.9503 0.0662437 13.8188 0.0314671 13.6791C-0.00330956 13.5394 -0.0102098 13.3943 0.0111604 13.2519C0.0543195 12.9644 0.21001 12.7058 0.443982 12.533L9.34809 5.96249C9.53679 5.8229 9.76536 5.74756 10.0001 5.74756C10.2349 5.74756 10.4635 5.8229 10.6522 5.96249L19.5563 12.533C19.7422 12.6699 19.8801 12.862 19.9503 13.0819C20.0204 13.3018 20.0193 13.5382 19.9469 13.7573C19.8746 13.9765 19.7349 14.1673 19.5476 14.3024C19.3604 14.4375 19.1352 14.51 18.9043 14.5096Z" fill=""/>
    <path class="urgent-svg" d="M18.9043 8.76057C18.6696 8.76097 18.4411 8.68612 18.2522 8.54702L10.0002 2.46386L1.7481 8.54702C1.51412 8.71983 1.22104 8.79269 0.93331 8.74956C0.645583 8.70643 0.386785 8.55086 0.213849 8.31706C0.0409137 8.08326 -0.0319941 7.79039 0.011165 7.50288C0.054324 7.21536 0.210015 6.95676 0.443986 6.78395L9.3481 0.213471C9.5368 0.0738799 9.76537 -0.00146484 10.0002 -0.00146484C10.2349 -0.00146484 10.4635 0.0738799 10.6522 0.213471L19.5563 6.78395C19.7422 6.92087 19.8801 7.11298 19.9503 7.33286C20.0204 7.55274 20.0193 7.78914 19.947 8.00832C19.8746 8.22751 19.7349 8.41826 19.5476 8.55335C19.3604 8.68844 19.1352 8.76096 18.9043 8.76057Z" fill=""/>
  </svg>`;

const mediumPriorityTemplate =
  `<svg class="medium-svg" width="20" height="8" viewBox="0 0 20 8" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_79630_4973)">
      <path class="medium-svg" d="M18.9041 7.45086H1.09589C0.805242 7.45086 0.526498 7.33456 0.320979 7.12755C0.11546 6.92054 0 6.63977 0 6.34701C0 6.05425 0.11546 5.77349 0.320979 5.56647C0.526498 5.35946 0.805242 5.24316 1.09589 5.24316H18.9041C19.1948 5.24316 19.4735 5.35946 19.679 5.56647C19.8845 5.77349 20 6.05425 20 6.34701C20 6.63977 19.8845 6.92054 19.679 7.12755C19.4735 7.33456 19.1948 7.45086 18.9041 7.45086Z" fill=""/>
      <path class="medium-svg" d="M18.9041 2.2077H1.09589C0.805242 2.2077 0.526498 2.0914 0.320979 1.88439C0.11546 1.67738 0 1.39661 0 1.10385C0 0.81109 0.11546 0.530322 0.320979 0.32331C0.526498 0.116298 0.805242 0 1.09589 0L18.9041 0C19.1948 0 19.4735 0.116298 19.679 0.32331C19.8845 0.530322 20 0.81109 20 1.10385C20 1.39661 19.8845 1.67738 19.679 1.88439C19.4735 2.0914 19.1948 2.2077 18.9041 2.2077Z" fill=""/>
    </g>
    <defs>
      <clipPath id="clip0_79630_4973">
        <rect class="medium-svg" width="20" height="7.45098" fill=""/>
      </clipPath>
    </defs>
  </svg>`;

const lowPriorityTemplate =
  `<svg class="low-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
    <path class="low-svg" d="M10 8.76077C9.7654 8.76118 9.53687 8.68634 9.34802 8.54726L0.444913 1.97752C0.329075 1.89197 0.231235 1.78445 0.15698 1.66111C0.0827245 1.53777 0.033508 1.40102 0.0121402 1.25868C-0.031014 0.971193 0.0418855 0.678356 0.214802 0.444584C0.387718 0.210811 0.646486 0.0552534 0.934181 0.0121312C1.22188 -0.0309911 1.51493 0.0418545 1.74888 0.214643L10 6.29712L18.2511 0.214643C18.367 0.129087 18.4985 0.0671675 18.6383 0.0324205C18.7781 -0.00232646 18.9234 -0.00922079 19.0658 0.0121312C19.2083 0.0334832 19.3451 0.0826633 19.4685 0.156864C19.592 0.231064 19.6996 0.328831 19.7852 0.444584C19.8708 0.560336 19.9328 0.691806 19.9676 0.831488C20.0023 0.97117 20.0092 1.11633 19.9879 1.25868C19.9665 1.40102 19.9173 1.53777 19.843 1.66111C19.7688 1.78445 19.6709 1.89197 19.5551 1.97752L10.652 8.54726C10.4631 8.68634 10.2346 8.76118 10 8.76077Z" fill=""/>
    <path class="low-svg" d="M10 14.5093C9.7654 14.5097 9.53687 14.4349 9.34802 14.2958L0.444913 7.72606C0.210967 7.55327 0.0552944 7.29469 0.0121402 7.00721C-0.031014 6.71973 0.0418855 6.42689 0.214802 6.19312C0.387718 5.95935 0.646486 5.80379 0.934181 5.76067C1.22188 5.71754 1.51493 5.79039 1.74888 5.96318L10 12.0457L18.2511 5.96318C18.4851 5.79039 18.7781 5.71754 19.0658 5.76067C19.3535 5.80379 19.6123 5.95935 19.7852 6.19312C19.9581 6.42689 20.031 6.71973 19.9879 7.00721C19.9447 7.29469 19.789 7.55327 19.5551 7.72606L10.652 14.2958C10.4631 14.4349 10.2346 14.5097 10 14.5093Z" fill=""/>
  </svg>`;

function getAddTaskDialogContentTemplate() {
  return `<section class="add-task-dialog-content" role="dialog" aria-modal="true" aria-labelledby="add-task-title">
            <header class="add-task-header">
              <h2 id="add-task-title">Add Task</h2>
              <button class="close-btn" type="button" aria-label="Close add task" onclick="closeAddTaskDialog()">
                <img class="close-icon" src="../assets/icons/close-task-overlay.svg" alt="close add-task-dialog" />
              </button>
            </header>
            ${getTaskFormTemplate()}`;
}

function getTaskFormTemplate() {
  return `<form id="add-task-form" class="add-task-form" novalidate>
            ${getTaskFormContentTemplate()}
            <section class="form-buttons">
              <button type="button" class="btn-clear btn">
                <span>Clear</span>
                <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                  <path class="btn-svg-color" d="M8 8L24 24M24 8L8 24" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
              <button id="btn-create-task" type="submit" class="btn-create-task btn">
                <span>Create Task</span>
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
          </form>`;
}

function getTaskFormContentTemplate() {
  return `<section class="form-content">
            <label class="add-task-field add-task-title-field">
              <span class="visually-hidden">Title</span>
              <input id="taskTitleInput" name="title" type="text" placeholder="Enter a title" />
              <small data-error="title"></small>
            </label>

            <label class="add-task-field">
              <strong>Description <span>(optional)</span></strong>
              <textarea id="taskDescription" name="description" placeholder="Enter a Description"></textarea>
            </label>

            <label class="add-task-field">
              <strong>Due date</strong>
              <input id="taskDueDate" name="dueDate" type="date" />
              <small data-error="dueDate"></small>
            </label>

            <fieldset class="add-task-priority">
              <legend>Priority</legend>
              <div class="priority-buttons">
                <button id="btn-urgent" class="btn priority-btn" type="button" data-priority="urgent">
                  <span>Urgent</span>
                  <svg class="urgent-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
                    <path class="urgent-svg" d="M18.9043 14.5096C18.6696 14.51 18.4411 14.4351 18.2522 14.2961L10.0001 8.21288L1.74809 14.2961C1.63224 14.3816 1.50066 14.4435 1.36086 14.4783C1.22106 14.513 1.07577 14.5199 0.933305 14.4986C0.790837 14.4772 0.653973 14.428 0.530528 14.3538C0.407083 14.2796 0.299474 14.1818 0.213845 14.0661C0.128216 13.9503 0.0662437 13.8188 0.0314671 13.6791C-0.00330956 13.5394 -0.0102098 13.3943 0.0111604 13.2519C0.0543195 12.9644 0.21001 12.7058 0.443982 12.533L9.34809 5.96249C9.53679 5.8229 9.76536 5.74756 10.0001 5.74756C10.2349 5.74756 10.4635 5.8229 10.6522 5.96249L19.5563 12.533C19.7422 12.6699 19.8801 12.862 19.9503 13.0819C20.0204 13.3018 20.0193 13.5382 19.9469 13.7573C19.8746 13.9765 19.7349 14.1673 19.5476 14.3024C19.3604 14.4375 19.1352 14.51 18.9043 14.5096Z" fill=""/>
                    <path class="urgent-svg" d="M18.9043 8.76057C18.6696 8.76097 18.4411 8.68612 18.2522 8.54702L10.0002 2.46386L1.7481 8.54702C1.51412 8.71983 1.22104 8.79269 0.93331 8.74956C0.645583 8.70643 0.386785 8.55086 0.213849 8.31706C0.0409137 8.08326 -0.0319941 7.79039 0.011165 7.50288C0.054324 7.21536 0.210015 6.95676 0.443986 6.78395L9.3481 0.213471C9.5368 0.0738799 9.76537 -0.00146484 10.0002 -0.00146484C10.2349 -0.00146484 10.4635 0.0738799 10.6522 0.213471L19.5563 6.78395C19.7422 6.92087 19.8801 7.11298 19.9503 7.33286C20.0204 7.55274 20.0193 7.78914 19.947 8.00832C19.8746 8.22751 19.7349 8.41826 19.5476 8.55335C19.3604 8.68844 19.1352 8.76096 18.9043 8.76057Z" fill=""/>
                  </svg>
                </button>

                <button id="btn-medium" class="selected btn priority-btn" type="button" data-priority="medium">
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

                <button id="btn-low" class="btn priority-btn" type="button" data-priority="low">
                  <span>Low</span>
                  <svg class="low-svg" width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg">
                    <path class="low-svg" d="M10 8.76077C9.7654 8.76118 9.53687 8.68634 9.34802 8.54726L0.444913 1.97752C0.329075 1.89197 0.231235 1.78445 0.15698 1.66111C0.0827245 1.53777 0.033508 1.40102 0.0121402 1.25868C-0.031014 0.971193 0.0418855 0.678356 0.214802 0.444584C0.387718 0.210811 0.646486 0.0552534 0.934181 0.0121312C1.22188 -0.0309911 1.51493 0.0418545 1.74888 0.214643L10 6.29712L18.2511 0.214643C18.367 0.129087 18.4985 0.0671675 18.6383 0.0324205C18.7781 -0.00232646 18.9234 -0.00922079 19.0658 0.0121312C19.2083 0.0334832 19.3451 0.0826633 19.4685 0.156864C19.592 0.231064 19.6996 0.328831 19.7852 0.444584C19.8708 0.560336 19.9328 0.691806 19.9676 0.831488C20.0023 0.97117 20.0092 1.11633 19.9879 1.25868C19.9665 1.40102 19.9173 1.53777 19.843 1.66111C19.7688 1.78445 19.6709 1.89197 19.5551 1.97752L10.652 8.54726C10.4631 8.68634 10.2346 8.76118 10 8.76077Z" fill=""/>
                    <path class="low-svg" d="M10 14.5093C9.7654 14.5097 9.53687 14.4349 9.34802 14.2958L0.444913 7.72606C0.210967 7.55327 0.0552944 7.29469 0.0121402 7.00721C-0.031014 6.71973 0.0418855 6.42689 0.214802 6.19312C0.387718 5.95935 0.646486 5.80379 0.934181 5.76067C1.22188 5.71754 1.51493 5.79039 1.74888 5.96318L10 12.0457L18.2511 5.96318C18.4851 5.79039 18.7781 5.71754 19.0658 5.76067C19.3535 5.80379 19.6123 5.95935 19.7852 6.19312C19.9581 6.42689 20.031 6.71973 19.9879 7.00721C19.9447 7.29469 19.789 7.55327 19.5551 7.72606L10.652 14.2958C10.4631 14.4349 10.2346 14.5097 10 14.5093Z" fill=""/>
                  </svg>
                </button>
              </div>
            </fieldset>

            <div class="add-task-field">
              <strong>Assigned to <span>(optional)</span></strong>

              <details class="assigned-dropdown">
                <summary>
                  <span class="assigned-dropdown-text">Select contacts to assign</span>
                  <span class="assigned-dropdown-arrow" aria-hidden="true">▾</span>
                </summary>

                <div class="assigned-dropdown-list" role="group" aria-label="Assign contacts"></div>
              </details>

              <select id="assigned-contacts" name="assignedUsers" multiple hidden></select>
            </div>

            <label class="add-task-field">
              <strong>Category</strong>
              <select id="taskCategorySelect" name="category">
                <option value="">Select task category</option>
                <option>User Story</option>
                <option>Technical Task</option>
              </select>
              <small data-error="category"></small>
            </label>

            <label class="add-task-field">
              <strong>Subtasks <span>(optional)</span></strong>
              <input name="subtask" type="text" placeholder="Add new subtask" />
            </label>

            <ul id="taskSubtasks" class="add-task-subtasks"></ul>
          </section>`;
}

const editIconSvg =
  `<svg class="edit-icon handle-subtask-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"/>
  </svg>`;

const deleteIconSvg =
  `<svg class="delete-icon handle-subtask-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"/>
  </svg>`;

const checkIconSvg =
  `<svg class="check-icon handle-subtask-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.55002 15.15L18.025 6.675C18.225 6.475 18.4625 6.375 18.7375 6.375C19.0125 6.375 19.25 6.475 19.45 6.675C19.65 6.875 19.75 7.1125 19.75 7.3875C19.75 7.6625 19.65 7.9 19.45 8.1L10.25 17.3C10.05 17.5 9.81669 17.6 9.55002 17.6C9.28336 17.6 9.05002 17.5 8.85002 17.3L4.55002 13C4.35002 12.8 4.25419 12.5625 4.26252 12.2875C4.27086 12.0125 4.37502 11.775 4.57502 11.575C4.77502 11.375 5.01252 11.275 5.28752 11.275C5.56252 11.275 5.80002 11.375 6.00002 11.575L9.55002 15.15Z"/>
  </svg>`;

function getAddTaskSubtaskTemplate(index, title) {
  return `<li class="subtask-list" data-index="${index}">
            <div class="subtask-wrapper">
              <span>${title}</span>
              <div id="subtask-button-container" class="subtask-button-container">
                <button onclick="editSubtask(this)" type="button" class="subtask-btn" data-action="edit" aria-label="Edit subtask">${editIconSvg}</button>
                <button onclick="deleteSubtask(this)" type="button" class="subtask-btn" data-action="delete" aria-label="Delete subtask">${deleteIconSvg}</button>
              </div>
            </div>
          </li>`;
}

function getEditSubtaskTemplate(subtaskTitle) {
  return `<input class="subtask-edit-input" name="subtask-edit" value="${subtaskTitle}" />`;
}

function getAssignedContactOptionTemplate(initials, name) {
  return `<option value="${initials}">${name}</option>`;
}