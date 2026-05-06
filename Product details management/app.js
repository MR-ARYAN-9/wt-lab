const apiBase = new URL('./api/products.php', window.location.href).href;
const isFileProtocol = window.location.protocol === 'file:';

const elements = {
  productsContainer: document.getElementById('productsContainer'),
  refreshButton: document.getElementById('refreshButton'),
  newProductButton: document.getElementById('newProductButton'),
  productForm: document.getElementById('productForm'),
  formTitle: document.getElementById('formTitle'),
  productId: document.getElementById('productId'),
  category: document.getElementById('category'),
  name: document.getElementById('name'),
  description: document.getElementById('description'),
  price: document.getElementById('price'),
  mrp: document.getElementById('mrp'),
  badge: document.getElementById('badge'),
  icon: document.getElementById('icon'),
  submitButton: document.getElementById('submitButton'),
  cancelEditButton: document.getElementById('cancelEditButton'),
  statusMessage: document.getElementById('statusMessage'),
};

function showStatus(message, type = 'success') {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status ${type}`;
  elements.statusMessage.classList.remove('hidden');
}

function clearStatus() {
  elements.statusMessage.textContent = '';
  elements.statusMessage.className = 'status hidden';
}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    throw new Error(`${response.status} ${response.statusText}: Empty response from server`);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
}

function createActionButton(text, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = `button ${className}`;
  button.style.padding = '10px 14px';
  button.style.fontSize = '13px';
  button.addEventListener('click', onClick);
  return button;
}

async function fetchProducts() {
  if (isFileProtocol) {
    elements.productsContainer.innerHTML = '<p class="status error">This page must be opened through an HTTP server, not via file://. Start the PHP server and access the page via http://127.0.0.1:8000/index.html.</p>';
    return;
  }

  elements.productsContainer.innerHTML = '<p class="small-text">Loading products from the API…</p>';
  try {
    const response = await fetch(apiBase, { headers: { Accept: 'application/json' } });
    const payload = await parseJsonResponse(response);
    if (!response.ok || payload.ok !== true) {
      throw new Error(payload.error || `Failed to load products (${response.status})`);
    }
    renderProducts(payload.data || []);
  } catch (error) {
    elements.productsContainer.innerHTML = `<p class="status error">${error.message}</p>`;
  }
}

function renderProducts(products) {
  if (!Array.isArray(products) || products.length === 0) {
    elements.productsContainer.innerHTML = '<p class="small-text">No products available. Create one using the form below.</p>';
    return;
  }

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Product</th>
      <th>Category</th>
      <th>Price</th>
      <th>MRP</th>
      <th>Badge</th>
      <th>Actions</th>
    </tr>
  `;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  products.forEach((product) => {
    const tr = document.createElement('tr');

    const price = product.price != null ? `₹${Number(product.price).toFixed(2)}` : '—';
    const mrp = product.mrp != null ? `₹${Number(product.mrp).toFixed(2)}` : '—';

    tr.innerHTML = `
      <td>#${product.id}</td>
      <td>
        <strong>${escapeHtml(product.name)}</strong><br>
        <span class="small-text">${escapeHtml(product.description)}</span>
      </td>
      <td>${escapeHtml(product.category)}</td>
      <td>${price}</td>
      <td>${mrp}</td>
      <td>${product.badge ? `<span class="badge">${escapeHtml(product.badge)}</span>` : '—'}</td>
      <td></td>
    `;

    const actionsCell = tr.querySelector('td:last-child');
    actionsCell.style.display = 'flex';
    actionsCell.style.gap = '8px';
    actionsCell.style.flexWrap = 'wrap';

    actionsCell.appendChild(createActionButton('Edit', 'gray', () => startEditing(product)));
    actionsCell.appendChild(createActionButton('Delete', 'red', () => deleteProduct(product.id)));

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  elements.productsContainer.innerHTML = '';
  elements.productsContainer.appendChild(table);
}

function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function startEditing(product) {
  elements.productId.value = product.id;
  elements.category.value = product.category || '';
  elements.name.value = product.name || '';
  elements.description.value = product.description || '';
  elements.price.value = product.price ?? '';
  elements.mrp.value = product.mrp ?? '';
  elements.badge.value = product.badge || '';
  elements.icon.value = product.icon || '';
  elements.formTitle.textContent = `Edit product #${product.id}`;
  elements.submitButton.textContent = 'Update Product';
  window.scrollTo({ top: 0, behavior: 'smooth' });
  clearStatus();
}

function clearForm() {
  elements.productId.value = '';
  elements.category.value = '';
  elements.name.value = '';
  elements.description.value = '';
  elements.price.value = '';
  elements.mrp.value = '';
  elements.badge.value = '';
  elements.icon.value = '';
  elements.formTitle.textContent = 'Add new product';
  elements.submitButton.textContent = 'Save Product';
  clearStatus();
}

async function deleteProduct(id) {
  if (isFileProtocol) {
    showStatus('This page must be opened through an HTTP server before deleting products.', 'error');
    return;
  }

  if (!confirm('Delete this product permanently?')) {
    return;
  }
  try {
    const response = await fetch(`${apiBase}?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Accept: 'application/json' },
    });
    const payload = await parseJsonResponse(response);
    if (!response.ok || payload.ok !== true) {
      throw new Error(payload.error || 'Failed to delete product');
    }
    showStatus('Product deleted successfully.', 'success');
    await fetchProducts();
    clearForm();
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

async function submitForm(event) {
  event.preventDefault();
  clearStatus();

  const productId = elements.productId.value.trim();
  const payload = {
    category: elements.category.value.trim(),
    name: elements.name.value.trim(),
    description: elements.description.value.trim(),
    price: elements.price.value.trim(),
    mrp: elements.mrp.value.trim(),
    badge: elements.badge.value.trim(),
    icon: elements.icon.value.trim(),
  };

  if (!payload.name || !payload.description || payload.price === '') {
    showStatus('Name, description, and price are required.', 'error');
    return;
  }

  const method = productId ? 'PATCH' : 'POST';
  const url = productId ? `${apiBase}?id=${encodeURIComponent(productId)}` : apiBase;

  try {
    if (isFileProtocol) {
    showStatus('This page must be opened through an HTTP server before saving products.', 'error');
    return;
  }

  const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await parseJsonResponse(response);
    if (!response.ok || result.ok !== true) {
      throw new Error(result.error || `Failed to save product (${response.status})`);
    }

    showStatus(productId ? 'Product updated successfully.' : 'Product created successfully.', 'success');
    clearForm();
    await fetchProducts();
  } catch (error) {
    showStatus(error.message, 'error');
  }
}

function setupEventHandlers() {
  elements.refreshButton.addEventListener('click', fetchProducts);
  elements.newProductButton.addEventListener('click', () => {
    clearForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  elements.productForm.addEventListener('submit', submitForm);
  elements.cancelEditButton.addEventListener('click', clearForm);
}

window.addEventListener('DOMContentLoaded', () => {
  setupEventHandlers();
  fetchProducts();
});
