/**
 * @description Shows or clears the error message of a required field and sets aria invalid.
 * @param {HTMLFormElement} form - Form for creating a task.
 * @param {string} name - Name of the form field.
 * @param {boolean} isInvalid - Whether the field is invalid.
 * @returns {boolean} `true` if the field is invalid(empty), `false` if it's filled in.
 */
function showTaskFieldError(form, name, isInvalid) {
  const field = form.elements[name];
  const error = form.querySelector(`[data-error="${name}"]`);
  if (error) {
    error.textContent = isInvalid ? "This field is required" : "";
  }
  if (field) {
    field.setAttribute("aria-invalid", String(isInvalid));
  }
  return isInvalid;
}

/**
 * @description Validates all required fields in the add-task form.
 * @param {HTMLFormElement} form - Form for creating a task.
 * @returns {boolean} `true` if all required fields are filled, otherwise `false`.
 */
function isAddTaskFormValid(form) {
  const titleInvalid = !form.elements.title.value.trim();
  const dateInvalid = !form.elements.dueDate.value;
  const categoryInvalid = !form.elements.category.value;
  showTaskFieldError(form, "title", titleInvalid);
  showTaskFieldError(form, "dueDate", dateInvalid);
  showTaskFieldError(form, "category", categoryInvalid);
  return !titleInvalid && !dateInvalid && !categoryInvalid;
}

/**
 * @description Resets the add-task form to its original state.
 * @param {HTMLFormElement} form - Form that is being reset. 
 */
function resetForm(form = document.getElementById("add-task-form")) {
  if (!form) return;
  document.querySelector(".subtask-icon-container").style.opacity = 0;
  form.reset();
  form.querySelectorAll("[data-error]").forEach((error) => {
    error.textContent = "";
  });
  ["title", "dueDate", "category"].forEach((name) => {
    form.elements[name]?.setAttribute("aria-invalid", "false");
  });
  newTaskSubtasks = [];
  removeSelectedClassFromPriorityButtons();
  document.getElementById("btn-medium")?.classList.add("selected");
  renderNewSubtasks();
}