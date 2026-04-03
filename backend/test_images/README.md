# Verified Sample Shelf Images

This folder intentionally keeps a small, reviewable set of bookshelf photos in the public repository.

The keep-set below was manually sanity-checked against the live SmartBookshelf service on April 2, 2026. These images are not a benchmark dataset, but they are representative examples that still produce usable results and help explain the project without shipping a huge pile of private test photos.

## Retained files

- `IMG_6335.jpg`: medium-density technical shelf, 5 detected books in the April 2, 2026 check
- `IMG_6404.jpeg`: small calculus-focused shelf, 4 detected books in the April 2, 2026 check
- `IMG_6464.jpeg`: compact shelf segment, 7 detected books in the April 2, 2026 check
- `IMG_6484.jpg`: larger ML/statistics shelf, 24 detected books in the April 2, 2026 check
- `IMG_6485.jpeg`: dense shelf photo, 16 detected books in the April 2, 2026 check

## Why this folder is small

- It keeps the public repo focused on representative inputs instead of turning it into a dump of personal photos.
- It gives readers a concrete sample set that matches the current project story.
- It makes manual testing scripts easier to understand because they reference a known keep-set.

The live product and current frontend have moved on since this public snapshot, but these files are still useful for understanding the earlier pipeline.
