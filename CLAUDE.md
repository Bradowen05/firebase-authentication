# Todo Notes App - Project Documentation

## Project Overview

This is a notes management application built as part of the Salkaro onboarding process. The app allows users to create, view, filter, delete, and reorder notes with persistent storage.

**Repository:** https://github.com/salkaro/onboarding-b
**Branch:** `development` (working branch with reviewed code)
**Live Server:** http://localhost:3000

---

## Tech Stack

### Core Technologies
- **Next.js 16.1.1** - React framework with App Router
- **React 19** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Chakra UI** - Component library for consistent, accessible UI
- **Lucide React** - Icon library

### Development Tools
- **Turbopack** - Fast bundler (Next.js default)
- **ESLint** - Code linting
- **npm** - Package manager

---

## Features Implemented

### ✅ Core Features (Completed)
1. **Notes Management**
   - Create notes with title, description, and date
   - Maximum 5 notes limit
   - Delete notes functionality
   - Drag-and-drop reordering

2. **Data Persistence**
   - localStorage integration
   - Notes persist across page reloads and browser sessions

3. **Filtering System**
   - Filter by title
   - Filter by description
   - Filter by year (e.g., 2024)
   - Filter by month and year (e.g., January 2024)
   - Filter by exact date

4. **UI/UX Enhancements**
   - Collapsible "Add Note" form with toggle button
   - Collapsible "Filters" section with toggle button
   - Drag-and-drop with grip handle icons
   - Chakra UI components with consistent styling
   - Hover effects and transitions

### 🚧 Pending Features (From Review)
1. Simplify filters to single input for title and description
2. Auto-fill current date when opening Add Note form
3. Replace date filters with start date and end date range

---

## Project Structure

```
onboarding-b/
└── todo/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx          # Main notes application
    │   │   ├── layout.tsx         # Root layout with metadata
    │   │   ├── providers.tsx      # Chakra UI provider setup
    │   │   └── favicon.ico        # (Removed in review)
    │   └── styles/
    │       └── globals.css        # Global styles
    ├── public/                    # Static assets
    ├── reviews/
    │   └── NEXT_STEP.md          # Review feedback from Nick
    ├── package.json               # Dependencies
    ├── tsconfig.json              # TypeScript config
    ├── next.config.ts             # Next.js config
    └── .gitignore                 # Git ignore rules
```

---

## Key Files Explained

### `src/app/page.tsx` (Main Application)
The heart of the application. Contains:
- **State Management:** Uses React hooks (useState, useEffect)
- **localStorage Integration:** Saves/loads notes from browser storage
- **Note Interface:** TypeScript type definition for notes
- **CRUD Operations:** Add, delete, filter, reorder notes
- **Drag & Drop:** HTML5 drag and drop API implementation
- **Chakra UI Components:** All UI built with Chakra

**Key Functions:**
- `addNote()` - Creates new note, validates, saves to localStorage
- `deleteNote(id)` - Removes note by ID
- `handleDragStart()`, `handleDragOver()`, `handleDrop()` - Drag & drop handlers
- `saveToLocalStorage()` - Persists notes array as JSON string
- `filteredNotes` - Computed array based on filter state

### `src/app/providers.tsx`
Wraps the app with Chakra UI's provider to enable:
- Component system
- Theme tokens (colors, spacing, sizes)
- Default styling system

### `src/app/layout.tsx`
Root layout that:
- Sets page metadata (title, description)
- Loads Google fonts (Geist Sans, Geist Mono)
- Wraps children with Providers component
- Applies global CSS

---

## How It Works

### 1. Data Flow

```
User Action → State Update → localStorage Save → UI Re-render
```

**Example: Adding a Note**
1. User fills form (title, description, date)
2. Clicks "Add Note" button
3. `addNote()` function validates inputs
4. Creates note object with unique ID (timestamp)
5. Updates `notes` state with new array
6. Saves to localStorage as JSON string
7. React re-renders UI with new note
8. Form closes automatically

### 2. localStorage Strategy

```javascript
// Save (write)
localStorage.setItem('notes', JSON.stringify(notesArray))

// Load (read)
const savedNotes = localStorage.getItem('notes')
const notes = JSON.parse(savedNotes)
```

**Why JSON?**
- localStorage only stores strings
- JSON.stringify converts arrays/objects → string
- JSON.parse converts string → arrays/objects

### 3. Filtering Logic

Filters work by creating a computed array that checks each note against filter criteria:

```javascript
const filteredNotes = notes.filter(note => {
  const matchesTitle = note.title.includes(filterTitle)
  const matchesDescription = note.description.includes(filterDescription)
  const matchesDate = // complex date matching logic

  return matchesTitle && matchesDescription && matchesDate
})
```

### 4. Drag & Drop Implementation

Uses HTML5 Drag & Drop API:
1. **onDragStart** - Store dragged note's index
2. **onDragOver** - Allow drop (preventDefault)
3. **onDrop** - Reorder array by splicing and inserting

---

## Component Architecture

### Chakra UI Components Used

| Component | Purpose | Props Used |
|-----------|---------|------------|
| `Box` | Container div | `mb`, `p`, `bg`, `borderRadius` |
| `Container` | Centered content container | `maxW`, `p`, `borderRadius` |
| `Heading` | Headings (h1, h2) | `size`, `mb`, `color` |
| `Button` | Interactive buttons | `onClick`, `colorScheme`, `size`, `width` |
| `Input` | Text/date inputs | `placeholder`, `value`, `onChange`, `type`, `bg` |
| `Textarea` | Multi-line text input | `minH`, `resize`, `bg` |
| `VStack` | Vertical stack layout | `gap` |
| `Flex` | Flexbox container | `justify`, `align`, `gap` |
| `Text` | Paragraphs/text | `fontSize`, `color`, `lineHeight` |
| `CloseButton` | × close button | `onClick` |

---

## State Management

### State Variables

```typescript
// Notes data
const [notes, setNotes] = useState<Note[]>([])

// Form inputs
const [title, setTitle] = useState('')
const [description, setDescription] = useState('')
const [date, setDate] = useState('')

// Filter inputs
const [filterTitle, setFilterTitle] = useState('')
const [filterDescription, setFilterDescription] = useState('')
const [filterYear, setFilterYear] = useState('')
const [filterMonth, setFilterMonth] = useState('')
const [filterExactDate, setFilterExactDate] = useState('')

// UI toggles
const [showAddForm, setShowAddForm] = useState(false)
const [showFilters, setShowFilters] = useState(false)
```

### Why So Many State Variables?

Each piece of data that can change needs its own state:
- **Controlled components** - React controls input values
- **Independent updates** - Each input updates independently
- **Reactive UI** - Changes trigger immediate re-renders

---

## Review Feedback (From Nick)

### Issues Found
1. ❌ ChakraUI installed but not used initially
   - **Fixed:** Converted all HTML elements to Chakra components

### Changes Made by Reviewer
- ✅ Deleted template SVG files in `public/`
- ✅ Moved `globals.css` to `src/styles/` (better convention)
- ✅ Removed `favicon.ico`
- ✅ Fixed package.json peer dependencies

### Next Steps (TODO)
1. **Update to use ChakraUI** ✅ COMPLETED
2. **Simplify filters** - Single input for title + description
3. **Auto-fill date** - Set current date when form opens
4. **Date range filtering** - Start date + end date instead of year/month/exact

---

## Running the Project

### Development Server
```bash
cd ~/.vscode/salkaro-projects/onboarding-b/todo
npm run dev
```
Open http://localhost:3000

### Build for Production
```bash
npm run build
```
Creates optimized production build in `.next/` folder

### Install Dependencies
```bash
npm install
```

---

## Key Concepts for Beginners

### 1. Client vs Server Components
- **Server Components** (default) - Run on server, static HTML
- **Client Components** (`'use client'`) - Run in browser, interactive
- Our `page.tsx` is client component because it needs:
  - useState (state management)
  - Event handlers (onClick, onChange)
  - localStorage (browser API)

### 2. TypeScript Interfaces
Defines the "shape" of data:
```typescript
interface Note {
  id: string
  title: string
  description: string
  date: string
}
```
This tells TypeScript what properties a Note should have.

### 3. Array Methods
- `.map()` - Transform each item (display notes)
- `.filter()` - Keep matching items (filter notes)
- `.splice()` - Remove/add at index (drag & drop)

### 4. React Hooks
- `useState` - Store data that can change
- `useEffect` - Run code when component loads

### 5. Event Handlers
Functions that run when user interacts:
- `onClick` - Button clicks
- `onChange` - Input changes
- `onDragStart/onDrop` - Drag & drop events

---

## Common Patterns

### Conditional Rendering
```javascript
{!showAddForm ? (
  <Button>Show Form</Button>
) : (
  <Form>...</Form>
)}
```

### Controlled Components
```javascript
<Input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```

### Prop Spreading
```javascript
<Box
  mb={8}        // margin-bottom
  p={6}         // padding
  bg="gray.50"  // background color
/>
```

---

## Git Workflow

### Branches
- `main` - Original submission
- `development` - Current working branch (post-review)

### Commits
Latest commit includes:
- ChakraUI implementation
- All HTML → Chakra component conversions
- Provider setup with defaultSystem

---

## Troubleshooting

### Port Already in Use
```bash
# Kill Node processes
taskkill //F //IM node.exe //T

# Or use different port
npm run dev -- --port 3001
```

### localStorage Not Persisting
- Check browser privacy settings
- Ensure not in incognito/private mode
- Check browser console for errors

### Build Errors
```bash
# Clean and rebuild
rm -rf .next
npm run build
```

---

## Learning Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Chakra UI Components:** https://chakra-ui.com/docs/components
- **React Hooks:** https://react.dev/reference/react
- **TypeScript Basics:** https://www.typescriptlang.org/docs/

---

## Credits

**Developer:** bradowen05 (bradowen05@icloud.com)
**Reviewer:** Nick (RoyalGr4pe)
**Organization:** Salkaro
**Assistant:** Claude Sonnet 4.5 (Anthropic)

---

*Last Updated: January 13, 2026*
