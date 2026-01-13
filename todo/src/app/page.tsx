'use client'

import { useState, useEffect } from 'react'
import { Trash2, GripVertical } from 'lucide-react'

// This defines what a Note looks like - it has an id, title, description, and date
interface Note {
  id: string
  title: string
  description: string
  date: string
}

export default function Home() {
  // useState is a React hook that lets us store data
  // notes stores all our notes, setNotes is used to update them
  const [notes, setNotes] = useState<Note[]>([])

  // These store the values from our input fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  // These store the filter values
  const [filterTitle, setFilterTitle] = useState('')
  const [filterDescription, setFilterDescription] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [filterExactDate, setFilterExactDate] = useState('')

  // This controls whether the "Add Note" form is visible
  const [showAddForm, setShowAddForm] = useState(false)

  // This controls whether the "Filters" section is visible
  const [showFilters, setShowFilters] = useState(false)

  // useEffect runs when the component first loads
  // This loads saved notes from localStorage when the page loads
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      // Parse converts the JSON string back into an array of notes
      setNotes(JSON.parse(savedNotes))
    }
  }, []) // Empty array means this only runs once when page loads

  // This function saves notes to localStorage whenever they change
  const saveToLocalStorage = (notesToSave: Note[]) => {
    // JSON.stringify converts our notes array into a string so it can be saved
    localStorage.setItem('notes', JSON.stringify(notesToSave))
  }

  // Function to add a new note
  const addNote = () => {
    // Check if we already have 5 notes (maximum allowed)
    if (notes.length >= 5) {
      alert('Maximum 5 notes allowed!')
      return
    }

    // Check if all fields are filled
    if (!title || !description || !date) {
      alert('Please fill in all fields!')
      return
    }

    // Create a new note object
    const newNote: Note = {
      id: Date.now().toString(), // Use timestamp as unique ID
      title,
      description,
      date
    }

    // Add the new note to our notes array
    const updatedNotes = [...notes, newNote]
    setNotes(updatedNotes)
    saveToLocalStorage(updatedNotes)

    // Clear the input fields
    setTitle('')
    setDescription('')
    setDate('')

    // Close the form after adding the note
    setShowAddForm(false)
  }

  // Function to delete a note
  const deleteNote = (id: string) => {
    // Filter out the note with the matching id
    const updatedNotes = notes.filter(note => note.id !== id)
    setNotes(updatedNotes)
    saveToLocalStorage(updatedNotes)
  }

  // Drag and drop functions to reorder notes
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    // Store the index of the note being dragged
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', index.toString())
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // This is necessary to allow dropping
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault()
    const dragIndex = parseInt(e.dataTransfer.getData('text/html'))

    if (dragIndex === dropIndex) return // No change if dropped in same position

    // Create a copy of the filtered notes array
    const items = [...filteredNotes]
    // Remove the dragged item
    const [draggedItem] = items.splice(dragIndex, 1)
    // Insert it at the drop position
    items.splice(dropIndex, 0, draggedItem)

    // Update the main notes array with the new order
    setNotes(items)
    saveToLocalStorage(items)
  }

  // Filter notes based on filter inputs
  const filteredNotes = notes.filter(note => {
    // Check if note matches all filter criteria
    const matchesTitle = note.title.toLowerCase().includes(filterTitle.toLowerCase())
    const matchesDescription = note.description.toLowerCase().includes(filterDescription.toLowerCase())

    // Date filtering logic
    let matchesDate = true
    if (filterYear || filterMonth || filterExactDate) {
      const noteDate = new Date(note.date)
      const noteYear = noteDate.getFullYear().toString()
      const noteMonth = (noteDate.getMonth() + 1).toString().padStart(2, '0') // Month is 0-indexed
      const noteYearMonth = `${noteYear}-${noteMonth}`

      if (filterExactDate) {
        // If exact date is provided, match exact date
        matchesDate = note.date === filterExactDate
      } else if (filterMonth) {
        // If month is provided (format: YYYY-MM), match year and month
        matchesDate = noteYearMonth === filterMonth
      } else if (filterYear) {
        // If only year is provided, match year
        matchesDate = noteYear === filterYear
      }
    }

    return matchesTitle && matchesDescription && matchesDate
  })

  return (
    <div style={{
      minHeight: '100vh',
      padding: '40px 20px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: '#333'
        }}>
          My Notes ({notes.length}/5)
        </h1>

        {/* Add Note Button/Form */}
        <div style={{ marginBottom: '32px' }}>
          {!showAddForm ? (
            // Show button when form is hidden
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: '14px 24px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
            >
              + Add New Note
            </button>
          ) : (
            // Show form when button is clicked
            <div style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#555',
                  margin: 0
                }}>
                  Add New Note
                </h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0',
                    lineHeight: '1'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#333'
                  }}
                />

                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical',
                    color: '#333'
                  }}
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#333'
                  }}
                />

                <button
                  onClick={addNote}
                  style={{
                    padding: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  Add Note
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filters Button/Section */}
        <div style={{ marginBottom: '32px' }}>
          {!showFilters ? (
            // Show button when filters are hidden
            <button
              onClick={() => setShowFilters(true)}
              style={{
                padding: '14px 24px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
            >
              🔍 Filter Notes
            </button>
          ) : (
            // Show filters section when button is clicked
            <div style={{
              padding: '24px',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#555',
                  margin: 0
                }}>
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '24px',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0',
                    lineHeight: '1'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#666'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                >
                  ×
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  placeholder="Filter by title..."
                  value={filterTitle}
                  onChange={(e) => setFilterTitle(e.target.value)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#333'
                  }}
                />

                <input
                  type="text"
                  placeholder="Filter by description..."
                  value={filterDescription}
                  onChange={(e) => setFilterDescription(e.target.value)}
                  style={{
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#333'
                  }}
                />

                {/* Date Filters Section */}
                <div style={{
                  marginTop: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#666',
                    marginBottom: '12px'
                  }}>
                    Filter by Date (choose one):
                  </p>

                  <input
                    type="number"
                    placeholder="Filter by year (e.g., 2024)..."
                    value={filterYear}
                    onChange={(e) => {
                      setFilterYear(e.target.value)
                      setFilterMonth('')
                      setFilterExactDate('')
                    }}
                    min="1900"
                    max="2100"
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: '12px',
                      width: '100%'
                    }}
                  />

                  <input
                    type="month"
                    placeholder="Filter by month and year..."
                    value={filterMonth}
                    onChange={(e) => {
                      setFilterMonth(e.target.value)
                      setFilterYear('')
                      setFilterExactDate('')
                    }}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#333',
                      marginBottom: '12px',
                      width: '100%'
                    }}
                  />

                  <input
                    type="date"
                    placeholder="Filter by exact date..."
                    value={filterExactDate}
                    onChange={(e) => {
                      setFilterExactDate(e.target.value)
                      setFilterYear('')
                      setFilterMonth('')
                    }}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#333',
                      width: '100%'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notes List */}
        <div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#555'
          }}>
            My Notes
          </h2>

          {filteredNotes.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: '#999',
              padding: '40px',
              fontStyle: 'italic'
            }}>
              No notes found. {notes.length > 0 ? 'Try adjusting your filters.' : 'Add your first note above!'}
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredNotes.map((note, index) => (
                <div
                  key={note.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  style={{
                    padding: '20px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    position: 'relative',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    cursor: 'move'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    {/* Drag Handle */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: '#999',
                      cursor: 'grab'
                    }}>
                      <GripVertical size={20} />
                    </div>

                    {/* Content */}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start'
                    }}>
                      <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#333',
                        margin: 0
                      }}>
                        {note.title}
                      </h3>

                      <button
                        onClick={() => deleteNote(note.id)}
                        style={{
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Description and Date - aligned with content */}
                  <div style={{ marginLeft: '32px' }}>
                    <p style={{
                      color: '#666',
                      marginBottom: '12px',
                      lineHeight: '1.5'
                    }}>
                      {note.description}
                    </p>

                    <p style={{
                      fontSize: '14px',
                      color: '#999',
                      margin: 0
                    }}>
                      📅 {new Date(note.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
