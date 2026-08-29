function renderSidebar() {
  document.getElementById("sidebar").innerHTML = `
  <aside class="sidebar">
      <nav class="sidebar-navigation">
        <a href="#">
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
}

renderSidebar();
