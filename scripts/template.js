function getSidebarTemplate() {
  return `
      <section class="sidebar-navigation">
        <article class="page-links">
          <a href="./summary.html">
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path class="svg-fill" d="M21 1H3C1.89543 1 1 1.89648 1 3.00105C1 3.02939 1 3.04928 1 3.05917V21.0592C1 22.1311 1.86998 23 2.94187 23C2.97009 23 2.98998 23 2.99999 23H21C21.01 23 21.0299 23 21.0581 23C22.13 23 23 22.1311 23 21.0592V3.05915C23 3.04925 23 3.02937 23 3.00104C23 1.89648 22.1046 1 21 1ZM14 21.0592H3V13.0591H14V21.0592ZM14 11.0591H3V3.05917L14 3.05915V11.0591ZM21 21.0592H16V3.05917H21V21.0592Z" fill="#42526E"/>
            </svg>
            <span>Summary</span>
          </a>
          <a href="../pages/addTask.html">
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(1,1) scale(0.9167)">
              <path class="svg-fill" d="M18.4615 3.69207L18.4615 20.3075C18.461 20.7969 18.2664 21.2662 17.9203 21.6124C17.5742 21.9585 17.1049 22.1531 16.6154 22.1536L12.9231 22.1536C12.4336 22.1531 11.9643 21.9585 11.6182 21.6124C11.2721 21.2662 11.0774 20.7969 11.0769 20.3075L11.0769 3.69207C11.0774 3.20259 11.2721 2.7333 11.6182 2.38719C11.9643 2.04107 12.4336 1.84641 12.9231 1.84592L16.6154 1.84592C17.1049 1.84641 17.5742 2.04107 17.9203 2.38719C18.2664 2.7333 18.461 3.20259 18.4615 3.69207ZM12.9231 20.3075L16.6154 20.3075L16.6154 3.69207L12.9231 3.69207L12.9231 20.3075ZM12.9231 3.69207L12.9231 20.3075C12.9226 20.7969 12.7279 21.2662 12.3818 21.6123C12.0357 21.9584 11.5664 22.1531 11.0769 22.1536L7.38462 22.1536C6.89513 22.1531 6.42584 21.9584 6.07973 21.6123C5.73361 21.2662 5.53895 20.7969 5.53846 20.3074L5.53846 3.69206C5.53895 3.20258 5.73361 2.73328 6.07973 2.38717C6.42584 2.04105 6.89513 1.84639 7.38461 1.8459L11.0769 1.8459C11.5664 1.84639 12.0357 2.04105 12.3818 2.38717C12.7279 2.73328 12.9226 3.20259 12.9231 3.69207ZM7.38462 20.3074L11.0769 20.3075L11.0769 3.69207L7.38461 3.69206L7.38462 20.3074ZM7.38461 3.69206L7.38462 20.3074C7.38413 20.7969 7.18946 21.2662 6.84335 21.6123C6.49723 21.9584 6.02794 22.1531 5.53846 22.1536L1.84615 22.1536C1.35667 22.1531 0.887381 21.9584 0.541266 21.6123C0.195151 21.2662 0.000488688 20.7969 -8.07075e-08 20.3074L-8.06989e-07 3.69206C0.000487919 3.20258 0.19515 2.73328 0.541265 2.38717C0.88738 2.04105 1.35667 1.84639 1.84615 1.8459L5.53846 1.8459C6.02794 1.84639 6.49723 2.04105 6.84335 2.38717C7.18946 2.73328 7.38413 3.20258 7.38461 3.69206ZM1.84615 20.3074L5.53846 20.3074L5.53846 3.69206L1.84615 3.69206L1.84615 20.3074Z" fill="#42526E"/>
              <path class="svg-fill" d="M24 3.69228L24 20.3077C23.9995 20.7971 23.8048 21.2664 23.4587 21.6125C23.1126 21.9587 22.6433 22.1533 22.1538 22.1538L18.4615 22.1538C17.9721 22.1533 17.5028 21.9587 17.1567 21.6125C16.8105 21.2664 16.6159 20.7969 16.6154 20.3075L16.6154 3.69207C16.6159 3.20259 16.8105 2.7335 17.1567 2.38739C17.5028 2.04127 17.9721 1.84661 18.4615 1.84612L22.1538 1.84612C22.6433 1.84661 23.1126 2.04127 23.4587 2.38739C23.8048 2.7335 23.9995 3.2028 24 3.69228ZM18.4615 20.3075L22.1538 20.3077L22.1538 3.69228L18.4615 3.69207L18.4615 20.3075Z" fill="#42526E"/>
              </g>
            </svg>
            <span>Board</span>
          </a>
          <a href="../pages/contacts.html">
            <svg width="24px" height="24px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_78693_296" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
              <rect class="svg-fill" width="24" height="24" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_78693_296)">
              <path class="svg-fill" transform="translate(1,1) scale(0.9167)" d="M12 19.2C10.88 19.2 9.80995 19.375 8.78995 19.725C7.76995 20.075 6.83995 20.6 5.99995 21.3V21.6H18V21.3C17.16 20.6 16.23 20.075 15.21 19.725C14.19 19.375 13.12 19.2 12 19.2ZM3.59995 20.22C4.67995 19.16 5.93495 18.325 7.36495 17.715C8.79495 17.105 10.34 16.8 12 16.8C13.66 16.8 15.205 17.105 16.635 17.715C18.065 18.325 19.32 19.16 20.4 20.22V4.8H3.59995V20.22ZM12 14.4C10.84 14.4 9.84995 13.99 9.02995 13.17C8.20995 12.35 7.79995 11.36 7.79995 10.2C7.79995 9.04 8.20995 8.05 9.02995 7.23C9.84995 6.41 10.84 6 12 6C13.16 6 14.15 6.41 14.97 7.23C15.79 8.05 16.2 9.04 16.2 10.2C16.2 11.36 15.79 12.35 14.97 13.17C14.15 13.99 13.16 14.4 12 14.4ZM12 12C12.5 12 12.925 11.825 13.275 11.475C13.625 11.125 13.8 10.7 13.8 10.2C13.8 9.7 13.625 9.275 13.275 8.925C12.925 8.575 12.5 8.4 12 8.4C11.5 8.4 11.075 8.575 10.725 8.925C10.375 9.275 10.2 9.7 10.2 10.2C10.2 10.7 10.375 11.125 10.725 11.475C11.075 11.825 11.5 12 12 12ZM3.59995 24C2.93995 24 2.37495 23.765 1.90495 23.295C1.43495 22.825 1.19995 22.26 1.19995 21.6V4.8C1.19995 4.14 1.43495 3.575 1.90495 3.105C2.37495 2.635 2.93995 2.4 3.59995 2.4H4.79995V1.2C4.79995 0.537258 5.33721 0 5.99995 0C6.66269 0 7.19995 0.537258 7.19995 1.2V2.4H16.8V1.2C16.8 0.537258 17.3372 0 18 0C18.6627 0 19.2 0.537259 19.2 1.2V2.4H20.4C21.06 2.4 21.625 2.635 22.095 3.105C22.565 3.575 22.8 4.14 22.8 4.8V21.6C22.8 22.26 22.565 22.825 22.095 23.295C21.625 23.765 21.06 24 20.4 24H3.59995Z" fill="#42526E"/>
              </g>
            </svg>
            <span>Contacts</span>
          </a>
        </article>
        <footer class="sidebar-footer">
          <a class="privacy-policy-link" href="./privacy_policy.html">Privacy Policy</a>
          <a class="legal-notice-link" href="./legal_notice.html">Legal Notice</a>
        </footer>
      </section>
    `;
}
function navigationBeforeLogin() {
  return `<section class="sidebar-navigation-before-login">
            <article class="page-links-before-login">
              <a href="./index.html">
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path class="svg-fill" d="M12.2222 22C11.8759 22 11.5856 21.8829 11.3514 21.6486C11.1171 21.4144 11 21.1241 11 20.7778C11 20.4315 11.1171 20.1412 11.3514 19.9069C11.5856 19.6727 11.8759 19.5556 12.2222 19.5556H19.5556V2.44444H12.2222C11.8759 2.44444 11.5856 2.32731 11.3514 2.09306C11.1171 1.8588 11 1.56852 11 1.22222C11 0.875926 11.1171 0.585648 11.3514 0.351389C11.5856 0.11713 11.8759 0 12.2222 0H19.5556C20.2278 0 20.8032 0.239352 21.2819 0.718056C21.7606 1.19676 22 1.77222 22 2.44444V19.5556C22 20.2278 21.7606 20.8032 21.2819 21.2819C20.8032 21.7606 20.2278 22 19.5556 22H12.2222ZM9.99167 12.2222H1.22222C0.875926 12.2222 0.585648 12.1051 0.351389 11.8708C0.11713 11.6366 0 11.3463 0 11C0 10.6537 0.11713 10.3634 0.351389 10.1292C0.585648 9.89491 0.875926 9.77778 1.22222 9.77778H9.99167L7.7 7.48611C7.47593 7.26204 7.36389 6.98704 7.36389 6.66111C7.36389 6.33519 7.47593 6.05 7.7 5.80556C7.92407 5.56111 8.20926 5.4338 8.55556 5.42361C8.90185 5.41343 9.19722 5.53056 9.44167 5.775L13.8111 10.1444C14.0556 10.3889 14.1778 10.6741 14.1778 11C14.1778 11.3259 14.0556 11.6111 13.8111 11.8556L9.44167 16.225C9.19722 16.4694 8.90694 16.5866 8.57083 16.5764C8.23472 16.5662 7.94444 16.4389 7.7 16.1944C7.47593 15.95 7.36898 15.6597 7.37917 15.3236C7.38935 14.9875 7.50648 14.7074 7.73056 14.4833L9.99167 12.2222Z" fill=""/>
                </svg>
                <p>Log in</p>
              </a>
              <footer class="sidebar-footer-before-login">
                <a class="privacy-policy-link" href="./privacy_policy.html">Privacy Policy</a>
                <a class="legal-notice-link" href="./legal_notice.html">Legal Notice</a>
              </footer>
            </article>
          </section>`;
}

const headerTemplate = `
  <div class="content-limit">
    <div class="header-left">
        <img src="../assets/icons/logo-white.svg" alt="Join Logo"/>
    </div>
    <div class="header-right">
      <span class="kanban-text">Kanban Project Management Tool</span>
      <button id="help-button" class="header-icon-button" type="button" aria-label="Open help">
        <img class="help-icon" src="../assets/icons/help.svg" alt="Open help" />
      </button>
      <nav id="header-menu" class="header-menu" popover="manual">
        <a class="help" href="../pages/help.html">Help</a>
        <a href="../pages/legal_notice.html">Legal Notice</a>
        <a href="../pages/privacy_policy.html">Privacy Policy</a>
        <button id="logout-button" type="button">Log out</button>
      </nav>
      <button id="profile-button" class="header-icon-button" type="button" aria-label="Open user profile" popovertarget="header-menu">
        <span id="profile-badge">SM</span>
      </button>
    </div>
  </div>
`;

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
                  <button type="button" class="password-toggle" aria-label="Show password">
                    <img id="login-password-toggle-icon" class="lock-img"
                        src="./assets/icons/lock.svg" alt="" />
                  </button>
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
                <button type="button" class="password-toggle" aria-label="Show password">
                  <img id="sign-up-password-toggle-icon" class="lock-img" src="./assets/icons/lock.svg" alt="">
                </button>
              </div>
              <span class="error-msg visibility-hidden"></span>
            </div>

            <div class="input-wrapper" >
                <div class="input-content-container" id="confirm-password-border-bottom">
                  <input class="input-field" type="password" id="confirm-password" required placeholder="Confirm Password">
                  <button type="button" class="password-toggle" aria-label="Show password">
                    <img id="confirm-password-toggle-icon" class="lock-img" src="./assets/icons/lock.svg" alt="">
                  </button>
                </div>
                <span id="invalid-pw-confirm-msg" class="error-msg visibility-hidden">passwords do not match</span>
            </div>
            `;
}
