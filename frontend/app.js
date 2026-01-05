const API_BASE = 'http://localhost:3000/api';
let currentToken = localStorage.getItem('token');

// Tabs
function showTab(tabEl, tabName) {
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.remove('active')
  );
  tabEl.classList.add('active');

  document.querySelectorAll('.form-container').forEach(f =>
    f.classList.remove('active')
  );

  const id =
    tabName === 'profile'
      ? 'profileSection'
      : `${tabName}Form`;

  document.getElementById(id)?.classList.add('active');

  if (tabName === 'profile' && currentToken) {
    fetchProfile();
  }
}

// Messages
function showMessage(id, text, isError = false) {
  const el = document.getElementById(id);
  el.textContent = text;
  el.className = `message ${isError ? 'error' : 'success'}`;
  el.classList.remove('hidden');
  setTimeout(() => el.classList.add('hidden'), 4000);
}

// Login
async function login() {
  const email = loginEmail.value;
  const password = loginPassword.value;

  if (!email || !password) {
    return showMessage('loginMessage', 'Fill all fields', true);
  }

  const res = await fetch(`${API_BASE}/auth/login`, {
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

// Register
async function register() {
  const body = {
    name: regName.value,
    email: regEmail.value,
    password: regPassword.value
  };

  const res = await fetch(`${API_BASE}/auth/register`, {
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

// Profile
async function fetchProfile() {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: {
      Authorization: `Bearer ${currentToken}`
    }
  });

  if (!res.ok) return;

  const { user } = await res.json();

  profileContent.innerHTML = `
    <h3>Welcome ${user.name}</h3>
    <p>Email: ${user.email}</p>
    <p>ID: ${user.id}</p>
  `;
}

// Logout
function logout() {
  localStorage.removeItem('token');
  currentToken = null;
  showTab(document.querySelector('.tab'), 'login');
}
