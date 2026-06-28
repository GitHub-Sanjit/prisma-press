That's a good workflow, especially if you're following a course or building features incrementally. It gives you a clean history and lets you go back to any module at any time.

A common Git workflow would look like this:

### 1. Start from your main branch

```bash
git checkout main
git pull origin main
```

### 2. Create a branch for Module 20

```bash
git checkout -b module20
```

Work on Module 20.

Commit your progress:

```bash
git add .
git commit -m "Complete Module 20"
```

Push it:

```bash
git push -u origin module20
```

---

### 3. Create Module 21 from Module 20

Since Module 21 builds on Module 20, switch to `module20` first:

```bash
git checkout module20
```

Create the next branch:

```bash
git checkout -b module21
```

Now work on Module 21.

Commit and push:

```bash
git add .
git commit -m "Complete Module 21"
git push -u origin module21
```

---

### 4. Continue the pattern

```text
main
 └── module20
      └── module21
            └── module22
                  └── module23
                        └── ...
```

Commands:

```bash
git checkout module21
git checkout -b module22

git checkout module22
git checkout -b module23
```

---

## If you finish a module

```bash
git add .
git commit -m "Complete Module 22"
git push
```

---

## Benefits

* ✅ Every module has its own snapshot.
* ✅ You can compare modules easily.
* ✅ You can go back to any module.
* ✅ If you make a mistake in Module 24, Module 23 remains untouched.

---

## Alternative (recommended for portfolio projects)

If this project is something you'll continue beyond the course, another approach is to keep **one long-lived development branch** and use **Git tags** to mark each module milestone:

```text
main
 └── develop
       ↑
     tag: module20
       ↑
     tag: module21
       ↑
     tag: module22
```

For example:

```bash
git tag module20
git push origin module20

# After finishing the next module
git tag module21
git push origin module21
```

This avoids creating dozens of branches while still letting you check out the exact state of the project at each module:

```bash
git checkout module20
```

### Which should you choose?

* If your goal is **learning and submitting each module separately**, use **branches** (`module20`, `module21`, `module22`).
* If your goal is to maintain **one evolving project** and simply record milestones, use **Git tags**. This is often cleaner for long-term projects.

For a learning project organized by modules, your branch-per-module approach is perfectly reasonable and easy to manage.
