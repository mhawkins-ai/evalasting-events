# How to Restore Your Website

Your live website files have been backed up in the `_site_backup/` folder.

## To re-enable the site when payment is received:

### Option A: Using Git (Recommended)
```bash
# Restore the backup files
mv _site_backup/index.html .
mv _site_backup/contact.html .
mv _site_backup/services.html .
mv _site_backup/portfolio.html .

# Commit and push
git add .
git commit -m "Restore website after payment received"
git push
```

### Option B: Manual Restore
1. Delete the current `index.html`
2. Go to `_site_backup/` folder
3. Move all HTML files back to the root directory

The site will automatically deploy to Netlify once the files are restored.

---

**Files currently disabled:**
- index.html (payment required message)
- contact.html
- services.html  
- portfolio.html

**Backup location:**
- _site_backup/ folder
