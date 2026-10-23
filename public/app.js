const products = [
  { name: 'Everyday Blender', category: 'Blenders', price: 48500, description: 'Blend smoothies, sauces and soups with a dependable countertop essential.', image: 'https://img.dinos.co.jp/kp/defaultMall/images/cms/39_7930/pixta_92735525_M.jpg?Mode=cmsp1s1' },
  { name: 'Compact Smoothie Blender', category: 'Blenders', price: 39500, description: 'Whip up quick breakfast blends and sauces with an easy-to-use kitchen helper.', image: 'https://img.dinos.co.jp/kp/defaultMall/images/cms/39_7930/pixta_92735525_M.jpg?Mode=cmsp1s1' },
  { name: 'Stainless Steel Pot Set', category: 'Cookware', price: 78500, description: 'A versatile set of lidded pots for simmering, boiling and family-sized meals.', image: 'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw11f80682/images/large/66920-004_1.jpg' },
  { name: 'Glass-Lid Cooking Pots', category: 'Cookware', price: 56000, description: 'Keep an eye on soups and stews while they simmer with clear, fitted lids.', image: 'https://www.zwilling.com/on/demandware.static/-/Sites-zwilling-master-catalog/default/dw11f80682/images/large/66920-004_1.jpg' },
  { name: 'Ceramic Coffee Cups — Set of 6', category: 'Drinkware', price: 24500, description: 'A colorful set for serving coffee, tea and other favourite hot drinks.', image: 'https://www.earthstore.in/cdn/shop/files/Solid_Multicolor_Coffee_Mug_Set_of_6_-_The_Earth_Store_-_-_-2304535.jpg?v=1723312619' },
  { name: 'Everyday Tea Mugs — Set of 6', category: 'Drinkware', price: 22000, description: 'Comfortable handled mugs for relaxed tea breaks and slow mornings.', image: 'https://www.earthstore.in/cdn/shop/files/Solid_Multicolor_Coffee_Mug_Set_of_6_-_The_Earth_Store_-_-_-2304535.jpg?v=1723312619' },
  { name: 'Classic White Dinner Plates — Set of 6', category: 'Tableware', price: 32000, description: 'Clean, simple plates that suit weekday dinners and special occasions alike.', image: 'https://i5.walmartimages.com/seo/10-Strawberry-Street-Simply-White-10-5-Round-Ceramic-Dinner-Plate-Set-of-6_9beff688-b1bb-4d75-89e3-ce058bcceb12.2ae40243ec8a2a67bd5f61c67f03726e.jpeg' },
  { name: 'Everyday Ceramic Plates — Set of 6', category: 'Tableware', price: 29500, description: 'Everyday dinner plates with a bright, timeless finish.', image: 'https://i5.walmartimages.com/seo/10-Strawberry-Street-Simply-White-10-5-Round-Ceramic-Dinner-Plate-Set-of-6_9beff688-b1bb-4d75-89e3-ce058bcceb12.2ae40243ec8a2a67bd5f61c67f03726e.jpeg' }
];

const money = value => '₦' + Number(value).toLocaleString('en-NG') + '.00';
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const getStored = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const saveStored = (key, value) => localStorage.setItem(key, JSON.stringify(value));

document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = document.getElementById('mobileNav');
  document.getElementById('menuToggle')?.addEventListener('click', () => mobileMenu?.classList.toggle('open'));
  mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // Home page product cards, cart, search drawer and newsletter.
  const homeGrid = document.getElementById('products');
  if (homeGrid) {
    homeGrid.innerHTML = products.map((product, index) => `<article class="product"><div class="product-img"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"><span class="badge">${product.category}</span><button class="quick" type="button" onclick="addToCart(${index})">Add to bag · ${money(product.price)}</button></div><div class="product-info"><div class="stars">★★★★★</div><h3>${escapeHtml(product.name)}</h3><p class="product-description">${escapeHtml(product.description)}</p><div class="price">${money(product.price)}</div></div></article>`).join('');
  }

  window.addToCart = index => {
    const item = products[index];
    if (!item) return;
    const bag = getStored('kitchenMallCart', []);
    bag.push(item);
    saveStored('kitchenMallCart', bag);
    const counter = document.getElementById('cartCount');
    if (counter) counter.textContent = bag.length;
    window.openDrawer?.('cart');
    const notice = document.getElementById('productMessage');
    if (notice) notice.textContent = `${item.name} added to your bag. Your bag has ${bag.length} item(s).`;
  };

  const drawer = document.getElementById('drawer');
  window.openDrawer = type => {
    if (!drawer) return;
    const title = document.getElementById('drawerTitle');
    const content = document.getElementById('drawerContent');
    drawer.classList.add('open');
    if (type === 'search') {
      title.textContent = 'Search';
      content.innerHTML = '<input class="searchbox" id="searchInput" placeholder="Search kitchen products…" aria-label="Search kitchen products"><div id="searchResults" class="overlay-msg">Search blenders, pots, cups and plates.</div>';
      document.getElementById('searchInput').addEventListener('input', event => {
        const query = event.target.value.toLowerCase();
        const matches = products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query));
        document.getElementById('searchResults').innerHTML = query ? (matches.map(product => `<p><a href="Products.html">${escapeHtml(product.name)} · ${money(product.price)}</a></p>`).join('') || 'No products found.') : 'Search blenders, pots, cups and plates.';
      });
      return;
    }
    const bag = getStored('kitchenMallCart', []);
    title.textContent = `Your Bag (${bag.length})`;
    if (!bag.length) {
      content.innerHTML = '<p class="overlay-msg" style="padding:20px 0">Your bag is empty.</p><a class="btn" href="Products.html">Browse products</a>';
      return;
    }
    const total = bag.reduce((sum, item) => sum + Number(item.price), 0);
    content.innerHTML = `<div class="cart-items">${bag.map(item => `<div class="cart-line"><span>${escapeHtml(item.name)}</span><b>${money(item.price)}</b></div>`).join('')}</div><div class="cart-total"><span>Subtotal</span><span>${money(total)}</span></div><a class="btn" style="width:100%" href="Products.html">Continue shopping</a>`;
  };
  window.closeDrawer = () => drawer?.classList.remove('open');
  drawer?.addEventListener('click', event => { if (event.target === drawer) window.closeDrawer(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') window.closeDrawer?.(); });
  const cartCount = document.getElementById('cartCount');
  if (cartCount) cartCount.textContent = getStored('kitchenMallCart', []).length;
  document.getElementById('signupForm')?.addEventListener('submit', event => {
    event.preventDefault();
    document.getElementById('formMsg').textContent = 'Thanks for joining Kitchen Mall updates!';
    event.target.reset();
  });

  // Product catalog and category filters.
  const productGrid = document.getElementById('productGrid');
  if (productGrid) {
    const renderProducts = filter => {
      const filtered = products.filter(product => filter === 'all' || product.category === filter);
      productGrid.innerHTML = filtered.map(product => `<article class="product"><div class="product-img"><img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy"><span class="badge">${product.category}</span><button class="quick" type="button" data-add-product="${products.indexOf(product)}">Add to bag · ${money(product.price)}</button></div><div class="product-info"><div class="stars">★★★★★</div><h3>${escapeHtml(product.name)}</h3><p class="product-description">${escapeHtml(product.description)}</p><div class="price">${money(product.price)}</div></div></article>`).join('');
    };
    renderProducts('all');
    document.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.remove('active'));
      button.classList.add('active');
      renderProducts(button.dataset.filter);
    }));
    productGrid.addEventListener('click', event => {
      const button = event.target.closest('[data-add-product]');
      if (button) window.addToCart(Number(button.dataset.addProduct));
    });
  }

  // E-bike order requests are saved in this browser and shown on the profile page.
  const bikeForm = document.getElementById('ebikeForm');
  if (bikeForm) {
    const model = document.getElementById('bikeModel');
    const quantity = document.getElementById('quantity');
    const estimate = document.getElementById('estimate');
    const updateEstimate = () => {
      const price = Number(model.selectedOptions[0]?.dataset.price || 0);
      estimate.textContent = price ? `Estimated total: ${money(price * Number(quantity.value || 1))} · Final price and availability will be confirmed by our team.` : 'Select a model to see its estimated total.';
    };
    model.addEventListener('change', updateEstimate);
    quantity.addEventListener('input', updateEstimate);
    bikeForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(bikeForm);
      const selected = model.selectedOptions[0];
      const order = { id: 'EB-' + Date.now().toString().slice(-7), type: 'E-bike', model: formData.get('model'), quantity: Number(formData.get('quantity')), total: Number(selected.dataset.price) * Number(formData.get('quantity')), name: formData.get('name'), phone: formData.get('phone'), email: formData.get('email'), address: formData.get('address'), payment: formData.get('payment'), date: new Date().toLocaleDateString() };
      const orders = getStored('kitchenMallOrders', []);
      orders.unshift(order);
      saveStored('kitchenMallOrders', orders);
      document.getElementById('orderMessage').textContent = `Order request ${order.id} saved. Our team will contact you to confirm the details.`;
      bikeForm.reset();
      updateEstimate();
    });
  }

  // Local demonstration account flow. A production site should use a secure server.
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  if (loginForm && registerForm) {
    const setMode = mode => {
      const registering = mode === 'register';
      loginForm.hidden = registering;
      registerForm.hidden = !registering;
      document.querySelectorAll('.auth-tab').forEach(button => {
        const active = button.dataset.mode === mode;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
    };
    document.querySelectorAll('.auth-tab').forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
    document.getElementById('registerFooter')?.addEventListener('click', () => localStorage.setItem('kitchenMallOpenRegister', '1'));
    if (localStorage.getItem('kitchenMallOpenRegister')) {
      localStorage.removeItem('kitchenMallOpenRegister');
      setMode('register');
    }
    registerForm.addEventListener('submit', event => {
      event.preventDefault();
      const account = { name: document.getElementById('registerName').value.trim(), email: document.getElementById('registerEmail').value.trim().toLowerCase(), phone: document.getElementById('registerPhone').value.trim() };
      saveStored('kitchenMallAccount', account);
      saveStored('kitchenMallUser', { name: account.name, email: account.email });
      location.href = 'Profile.html';
    });
    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const account = getStored('kitchenMallAccount', null);
      if (!account || account.email !== email) {
        document.getElementById('loginMessage').textContent = 'No local demo account matches this email. Please register first.';
        return;
      }
      saveStored('kitchenMallUser', { name: account.name, email: account.email });
      location.href = 'Profile.html';
    });
  }

  // Profile and order history.
  const profileMount = document.getElementById('profileContent');
  if (profileMount) {
    const user = getStored('kitchenMallUser', null);
    if (!user) {
      profileMount.innerHTML = '<div class="form-card profile-empty"><div class="eyebrow">Not signed in</div><h2>Sign in to view your profile</h2><p class="muted-copy">Log in or create an account to see your account details and e-bike order requests.</p><a class="btn" href="Login.html">Login or register <span class="arrow">→</span></a></div>';
    } else {
      const orders = getStored('kitchenMallOrders', []);
      profileMount.innerHTML = `<div class="profile-welcome"><div><div class="eyebrow">Welcome to Kitchen Mall</div><h2>${escapeHtml(user.name)}</h2><p class="muted-copy">${escapeHtml(user.email)}</p></div><button class="btn btn-outline" id="logout" type="button">Log out</button></div><div class="profile-grid"><section class="form-card"><div class="eyebrow">Account details</div><h2>Your information</h2><p><strong>Name</strong><br>${escapeHtml(user.name)}</p><p><strong>Email</strong><br>${escapeHtml(user.email)}</p><a class="textlink" href="E-bike.html">Place an e-bike order →</a></section><section class="form-card"><div class="eyebrow">Order history</div><h2>Your orders</h2>${orders.length ? orders.map(order => `<article class="order-item"><div><strong>${escapeHtml(order.type)}: ${escapeHtml(order.model)}</strong><p>Order ${escapeHtml(order.id)} · ${escapeHtml(order.date)} · Qty ${Number(order.quantity)}</p><small>${escapeHtml(order.payment)} · ${escapeHtml(order.address)}</small></div><b>${money(order.total)}</b></article>`).join('') : '<p class="muted-copy">No orders yet. Your submitted e-bike order requests will appear here.</p>'}</section></div>`;
      document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('kitchenMallUser');
        location.reload();
      });
    }
  }
});
