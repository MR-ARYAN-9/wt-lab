# Product Details Management

This folder contains a PHP/MySQL backend for product management and an API that the `E-Commercial-HTML&CSS/index.html` storefront can consume.

## Files

- `schema.sql` — creates the `studentverse_market` database and `products` table, plus seed data.
- `includes/db.php` — database connection helper.
- `includes/http.php` — JSON response helpers.
- `api/products.php` — REST API for listing, creating, updating, and deleting products.
- `admin/index.php` — product admin dashboard.
- `admin/create.php` — add a new product.
- `admin/edit.php` — edit an existing product.
- `admin/delete.php` — delete a product.
- `index.html` — product management dashboard page for viewing and updating products from the browser.
- `app.js` — frontend script used by `index.html` to call the API and manage products.
- `../E-Commercial-HTML&CSS/products.js` — frontend script that loads products from the API into the storefront.

## Setup

1. Import the database schema into MySQL:
   - Use phpMyAdmin, MySQL Workbench, or CLI:
     ```sql
     SOURCE "c:/WT-LAB/Product details management/schema.sql";
     ```
2. Update database credentials in `includes/db.php` if needed.

## Run locally

### Option A: PHP built-in server (recommended)

1. Open a terminal in `c:/WT-LAB/Product details management`.
2. Run:
   ```powershell
   php -S 127.0.0.1:8000
   ```
   If `php` is not on your PATH but you have XAMPP installed, run:
   ```powershell
   & 'C:\xampp\php\php.exe' -S 127.0.0.1:8000
   ```
3. Open:
   - Storefront: `http://127.0.0.1:8000/E-Commercial-HTML&CSS/index.html`
   - Product management dashboard: `http://127.0.0.1:8000/index.html`
   - API: `http://127.0.0.1:8000/api/products.php`
   - Admin: `http://127.0.0.1:8000/admin/index.php`

### Option B: XAMPP/WAMP

- Start Apache and MySQL in the XAMPP Control Panel.
- Copy or symlink `c:/WT-LAB` into `C:\xampp\htdocs`, or move this project into a subfolder of `htdocs`.
- Open:
  - `http://127.0.0.1/Product%20details%20management/index.html`
  - `http://127.0.0.1/Product%20details%20management/api/products.php`
  - `http://127.0.0.1/Product%20details%20management/admin/index.php`

## Notes

- The storefront now loads products dynamically from the PHP API.
- The management dashboard at `index.html` must be opened in a browser through an HTTP server, not directly via `file://`.
- CORS is enabled in `api/products.php`, so the page can fetch data from a local PHP server.
- If `php` is not available in your terminal, install PHP or use XAMPP/WAMP.
- Database credentials can be customized with environment variables:
  - `DB_HOST`
  - `DB_NAME`
  - `DB_USER`
  - `DB_PASS`

## Quick local start

1. Open PowerShell in `c:/WT-LAB/Product details management`.
2. Run one of these scripts:
   - `./start-server.ps1` (PowerShell)
   - `./start-server.bat` (Command Prompt)
3. If PHP is installed, the page will be available at:
   - `http://127.0.0.1:8000/index.html`
