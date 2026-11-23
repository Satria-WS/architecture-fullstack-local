# Code & Architecture Review: Focus To-Do

> [!NOTE]
> This review is specifically targeted at **junior programmer learning** – highlighting what is correct, explaining why patterns are used, and surfacing improvements in plain language.

---

## Overall Verdict: ✅ Strong Foundation — A Few Improvements Needed

The project follows a **production-grade, senior-level architecture** that is rare for a first Next.js build. The vast majority of the code is clean, correct, and idiomatic. Below are detailed assessments by area.

---

## ✅ What Is Done Correctly (Keep These Habits)

### 1. Feature-Based Architecture (Excellent)

```
src/features/todos/
  actions/    ← Writes (Server Actions)
  queries/    ← Reads (Server Components)
  components/ ← UI
  schemas/    ← Validation
  types/      ← Types
```

**Why this is great**: Code for a feature lives together, not scattered across random folders. When a junior dev needs to find "how does todo creation work?", they look in one place. This is what real teams use at scale.

---

### 2. Thin Routing Layer (Excellent)

`src/app/(dashboard)/todos/page.tsx` only does two things: fetch data and pass it to a component.

```tsx
// ✅ CORRECT: Page is thin — just assembly
async function TodosFeed() {
  const todos = await getTodos(); // query layer does the work
  return <TodoList initialTodos={todos} />;
}
```

No business logic, no DB calls, no inline styles. The routing layer stays clean.

---

### 3. Separation of Reads vs Writes (Excellent)

| File | Purpose | ✅ Correct?
| --- | --- | ---
| `queries/get-todos.ts` | SELECT | ✅ Called from Server Component
| `actions/create-todo.ts` | INSERT | ✅ Has `"use server"` + `revalidatePath()`
| `actions/toggle-todo.ts` | UPDATE | ✅ Has `"use server"` + `revalidatePath()`
| `actions/delete-todo.ts` | DELETE | ✅ Has `"use server"` + `revalidatePath()`

---

### 4. IDOR Security (Excellent)

Every mutation correctly verifies ownership **before** acting:

```ts
// ✅ CORRECT: Always scope by userId (prevents user A deleting user B's todos)
const existing = await db.todo.findFirst({
  where: { id, userId: session.id }, // ← ownership check
});
if (!existing) return { success: false, message: "Not found or unauthorized." };
```

This pattern prevents **Insecure Direct Object Reference (IDOR)** attacks, which are common beginner mistakes.

---

### 5. Standardized Action Response Contract (Excellent)

```ts
// src/types/action-response.ts ✅
export type ActionResponse<T = null> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
};
```

Every server action returns this same shape. Junior devs can rely on a predictable pattern — always check `response.success`, always find messages in `response.message`.

---

### 6. Singleton Prisma Client (Correct)

```ts
// src/lib/db.ts ✅
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const db = globalForPrisma.prisma ?? new PrismaClient({ ... });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
```

In Next.js development, the server restarts on every file change. Without this pattern, you'd exhaust database connection limits. This is the **official Prisma recommended pattern** for Next.js.

---

### 7. Zod Validation on Server (Correct)

```ts
// ✅ NEVER trust client input — validate again on the server
const validation = createTodoSchema.safeParse(input);
if (!validation.success) {
  // map issues → field errors → return ActionResponse
}
```

Client-side validation is for UX only. Server-side validation with Zod is the security gate.

---

### 8. `useTransition` for Server Actions (Correct)

```tsx
// ✅ CORRECT: Does not block the UI thread
const [isToggling, startToggleTransition] = React.useTransition();
const handleToggle = () => {
  startToggleTransition(async () => {
    await toggleTodo(todo.id);
  });
};
```

Using `useTransition` instead of raw `async/await` in a click handler ensures React keeps the UI responsive and provides the `isPending` state for free.

---

### 9. `Suspense` for Data Fetching (Correct)

```tsx
// ✅ CORRECT: Streaming — shell renders immediately, data streams in
<Suspense fallback={<TodosLoading />}>
  <TodosFeed />
</Suspense>
```

The loading skeleton shows instantly. Users see content progressively rather than waiting for all data before anything renders.

---

### 10. Prisma Schema Design (Correct)

```prisma
// ✅ Foreign key index speeds up userId-scoped queries
@@index([userId])

// ✅ Cascade delete: deleting a user removes all their todos automatically
user User @relation(fields: [userId], references: [id], onDelete: Cascade)

// ✅ Table name maps to plural, lowercase (SQL convention)
@@map("todos")
```

---

## ⚠️ Issues to Fix (Improvements)

### Issue 1 — `toggleTodo` Makes 2 Database Calls (Performance Bug)

**Current code** in `toggle-todo.ts`:

```ts
// ⚠️ BAD: Finds the record first, then updates — 2 round-trips to the DB
const existing = await db.todo.findFirst({ where: { id, userId: session.id } });
const updated = await db.todo.update({ where: { id }, data: { completed: !existing.completed } });
```

**Problem**: Two separate round-trips to the database. The `findFirst` is only needed to get the current `completed` value.

**Better approach** — Prisma supports `updateManyAndReturn` and also the `NOT` trick, but the cleanest fix is a single `update` with `update` on the boolean using `findUniqueOrThrow` scope:

```ts
// ✅ BETTER: Single query — update the record only if it belongs to the user
const updated = await db.todo.update({
  where: {
    id,
    userId: session.id, // Prisma 5+ supports composite where on update
  },
  data: {
    completed: { set: ... } // still needs current value
  },
});
```

Actually for boolean toggle, 2 queries is acceptable if Prisma version doesn't support it natively. This is a **minor** issue, not a blocker.

---

### Issue 2 — `password` Field Is Nullable in Prisma Schema (Design Gap)

**Current schema**:

```prisma
model User {
  password  String?  // ← nullable
}
```

**Problem**: The `password` is optional (`String?`), which makes sense for OAuth/social logins. But right now there is no OAuth — only email+password. This means:

1. It's possible to create a user without a password (the `register` action sets it, but nothing enforces it at the DB level).
2. The `login` action must defensively check `if (!user.password)`.

**For a junior project**, this is acceptable as-is since you plan for OAuth later. But add a **comment** to explain the intent:

```prisma
// nullable to support future OAuth providers (Google, GitHub, etc.)
password  String?
```

---

### Issue 3 — `TodoList` Recalculates Counts on Every Render (Minor Optimization)

**Current code**:

```tsx
// ⚠️ These run on every render, even when filter doesn't change
const activeCount = initialTodos.filter((t) => !t.completed).length;
const completedCount = initialTodos.filter((t) => t.completed).length;
```

**Better**:

```tsx
// ✅ Memoize so they only recalculate when initialTodos changes
const { activeCount, completedCount } = React.useMemo(() => ({
  activeCount: initialTodos.filter((t) => !t.completed).length,
  completedCount: initialTodos.filter((t) => t.completed).length,
}), [initialTodos]);
```

For small lists this doesn't matter, but it's a good habit to learn early.

---

### Issue 4 — Magic Numbers in `auth.ts` (Readability)

**Current code**:

```ts
// ⚠️ What does 7 * 24 * 60 * 60 * 1000 mean? A junior dev has to calculate it.
const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
```

**Better** — name the constant:

```ts
// ✅ Self-documenting
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
```

---

### Issue 5 — `src/app/layout.tsx` Still Uses Old Root `app/` Import Path

The root layout at [src/app/layout.tsx](file:///e:/training/focus-todo/src/app/layout.tsx) was moved from the old root `app/` folder. Verify that there are no leftover references to the old `app/layout.tsx` path in open editor tabs (it shows as open but no longer exists at root).

---

### Issue 6 — `.env` File Should Be in `.gitignore`

**Current state**: `.env` contains a real `AUTH_SECRET`. Verify `.gitignore` has:

```
.env
.env.local
```

`.env.example` (without real values) should be committed. `.env` (with real values) must **never** be committed to version control.

---

### Issue 7 — No `loading.tsx` for Auth Routes

The dashboard has a `loading.tsx` skeleton. The auth route group `(auth)/` has no loading skeleton. When navigating to `/login` on a slow connection, there's a blank flash.

**Add** `src/app/(auth)/loading.tsx`:

```tsx
export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-96 w-full max-w-md rounded-xl bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
    </div>
  );
}
```

---

## 📋 Architecture Compliance Checklist

| Rule | Status | Notes |
| --- | --- | --- |
| Kebab-case file names | ✅ | All files follow `kebab-case.ts` |
| Unidirectional import flow | ✅ | No `app/` importing from `features/` circular deps |
| No DB calls in `src/app/` | ✅ | All queries inside `features/*/queries/` |
| Zod validation on server | ✅ | Every action validates before DB call |
| IDOR protection | ✅ | `userId` always in `where` clause |
| `revalidatePath` after mutations | ✅ | All 3 mutation actions call it |
| Standardized `ActionResponse<T>` | ✅ | All actions return this contract |
| `"use server"` on actions | ✅ | All action files begin with directive |
| `"use client"` on interactive UI | ✅ | Forms and interactive components marked |
| Session HTTP-only cookie | ✅ | `httpOnly: true, sameSite: "lax"` set |

---

## 🎓 Key Learning Takeaways for a Junior Developer

1. **Never trust client input** — Always validate with Zod on the server, even if you validated on the client.
2. **Always scope DB queries by `userId`** — Never just `where: { id }`. Always `where: { id, userId: session.id }`.
3. **Keep pages thin** — Pages fetch and assemble. Business logic lives in `features/`.
4. **Name your constants** — `SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000` beats the raw number.
5. **`useTransition` over raw async** — Keeps the UI responsive and provides `isPending` for free.
6. **`useMemo` for derived values** — Don't recalculate the same thing on every render.
7. **Commit `.env.example`, never `.env`** — Real secrets stay off version control forever.
