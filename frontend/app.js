const API_BASE = window.API_BASE || (window.location.hostname === 'localhost' && window.location.port === '8080'
  ? 'http://localhost:3000/api'
  : '/api');

let currentToken = localStorage.getItem('token');

// Tabs section, kind of messy but works
function showTab(tabEl, tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  tabEl.classList.add('active');

  document.querySelectorAll('.form-container').forEach(f => f.classList.remove('active'));

  const id = tabName === 'profile' ? 'profileSection' : `${tabName}Form`;   // fixed: backticks
  document.getElementById(id)?.classList.add('active');

  if (tabName === 'profile' && currentToken) {
    fetchProfile();
  }
}

// Messages, sometimes it flashes too fast, not sure why honestly
function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `message ${isError ? 'error' : 'success'}`;   // fixed: backticks
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 400);
}

// Login part, it breaks if the server sleeps, I think
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;
  if (!email || !password) {
    return showMessage('loginMessage', 'Fill all fields', true);
  }
  const res = await fetch(`${API_BASE}/auth/login`, {          // fixed: backticks
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    return showMessage('loginMessage', data.error, true);
  }
  currentToken = data.token;
  localStorage.setItem('token', data.token);
  showTab(document.querySelector('.tab:nth-child(3)'), 'profile');
}

// Register part, sometimes it double submits, not sure why that happens
async function register() {
  const body = {
    name: regName.value,
    email: regEmail.value,
    password: regPassword.value
  };
  const res = await fetch(`${API_BASE}/auth/register`, {       // fixed: backticks
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-registration-key': regKey.value
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (!res.ok) {
    return showMessage('registerMessage', data.error, true);
  }
  showMessage('registerMessage', 'Registered! Please login.');
  showTab(document.querySelector('.tab'), 'login');
}

// Profile, sometimes doesn’t load if token expired
async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`, {             // fixed: backticks
    headers: { Authorization: `Bearer ${currentToken}` }      // fixed: backticks
  });
  if (!res.ok) return;
  const { user } = await res.json();
  // fixed: proper template literal for innerHTML
  profileContent.innerHTML = `
    <div>
      <h3>Welcome ${user.name}</h3>
      <p>Email: ${user.email}</p>
      <p>ID: ${user.id}</p>
    </div>
  `;
}

// Logout, simple but feels smooth hope this is good enough
function logout() {
  localStorage.removeItem('token');
  currentToken = null;
  showTab(document.querySelector('.tab'), 'login');
}