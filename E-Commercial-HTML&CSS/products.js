/* Loads products from the PHP+MySQL API and renders them into #productsGrid */

function formatMoneyINR(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return String(value ?? '');
  return `₹${n.toFixed(0)}`;
}

function buildApiUrl() {
  // Works when you run a PHP server from the WT-LAB root folder.
  // Example page URL: http://127.0.0.1:8000/E-Commercial-HTML&CSS/index.html
  // API URL becomes:  http://127.0.0.1:8000/Product%20details%20management/api/products.php
  return new URL('../Product details management/api/products.php', window.location.href).toString();
}

function renderProductCard(p) {
  const icon = (p.icon && String(p.icon).trim()) ? String(p.icon) : '📦';
  const badge = (p.badge && String(p.badge).trim()) ? String(p.badge).trim() : null;

  const price = formatMoneyINR(p.price);
  const mrp = (p.mrp !== null && p.mrp !== undefined && String(p.mrp).trim() !== '') ? formatMoneyINR(p.mrp) : null;

  // Use the same visual tokens already present in the page.
  const card = document.createElement('div');
  card.style.cssText = 'background:#ffffff; border-radius:18px; width:260px; overflow:hidden; box-shadow:0 4px 25px rgba(0,0,0,0.08); transition:transform 0.2s;';

  const top = document.createElement('div');
  top.style.cssText = 'height:200px; background:linear-gradient(135deg,#667eea,#764ba2); display:flex; align-items:center; justify-content:center; font-size:64px; position:relative;';
  top.textContent = icon;

  if (badge) {
    const badgeEl = document.createElement('span');
    badgeEl.textContent = badge;
    badgeEl.style.cssText = 'position:absolute; top:12px; right:12px; background:#e94560; color:#fff; font-size:10px; font-weight:700; padding:4px 10px; border-radius:12px;';
    top.appendChild(badgeEl);
  }

  const body = document.createElement('div');
  body.style.cssText = 'padding:22px;';

  const cat = document.createElement('p');
  cat.textContent = p.category ?? 'General';
  cat.style.cssText = 'margin:0 0 6px; font-size:11px; color:#e94560; font-weight:700; letter-spacing:1px; text-transform:uppercase;';

  const title = document.createElement('h3');
  title.textContent = p.name ?? '';
  title.style.cssText = 'margin:0 0 8px; font-size:17px; font-weight:700; color:#1a1a2e;';

  const desc = document.createElement('p');
  desc.textContent = p.description ?? '';
  desc.style.cssText = 'margin:0 0 16px; font-size:13px; color:#889; line-height:1.5;';

  const priceRow = document.createElement('div');
  priceRow.style.cssText = 'display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;';

  const priceLeft = document.createElement('div');

  const priceNow = document.createElement('span');
  priceNow.textContent = price;
  priceNow.style.cssText = 'font-size:22px; font-weight:800; color:#e94560;';
  priceLeft.appendChild(priceNow);

  if (mrp) {
    const priceMrp = document.createElement('span');
    priceMrp.textContent = mrp;
    priceMrp.style.cssText = 'font-size:13px; color:#aab; text-decoration:line-through; margin-left:6px;';
    priceLeft.appendChild(priceMrp);
  }

  priceRow.appendChild(priceLeft);

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.textContent = '🛒 Add to Cart';
  btn.style.cssText = 'width:100%; padding:12px; background:linear-gradient(135deg,#e94560,#c62a47); color:#fff; border:none; border-radius:10px; font-size:14px; font-weight:700; cursor:pointer;';

  body.appendChild(cat);
  body.appendChild(title);
  body.appendChild(desc);
  body.appendChild(priceRow);
  body.appendChild(btn);

  card.appendChild(top);
  card.appendChild(body);

  return card;
}

async function loadProducts() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  const loading = document.getElementById('productsLoading');

  try {
    const apiUrl = buildApiUrl();
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/json' } });
    const payload = await res.json();

    if (!res.ok || !payload || payload.ok !== true) {
      throw new Error(payload?.error || 'Failed to load products');
    }

    const products = Array.isArray(payload.data) ? payload.data : [];

    grid.innerHTML = '';

    if (products.length === 0) {
      const empty = document.createElement('div');
      empty.textContent = 'No products found.';
      empty.style.cssText = 'color:#667788;';
      grid.appendChild(empty);
      return;
    }

    for (const p of products) {
      grid.appendChild(renderProductCard(p));
    }
  } catch (err) {
    if (loading) loading.remove();

    const msg = document.createElement('div');
    msg.style.cssText = 'background:#fff; border-radius:14px; padding:16px; color:#667788; box-shadow:0 4px 20px rgba(0,0,0,0.08); max-width:820px;';
    msg.innerHTML = `Could not load products from PHP/MySQL API.<br/><br/>
      <b>Fix:</b> run the site using a PHP server from the WT-LAB root folder (so the API path exists).`;

    grid.innerHTML = '';
    grid.appendChild(msg);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
