'use client'

import { useState, useEffect } from 'react'
import { Trash2, GripVertical } from 'lucide-react'
import {
  Box,
  Heading,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Text,
  IconButton,
  Flex,
  CloseButton,
} from '@chakra-ui/react'


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
  const [searchQuery, setSearchQuery] = useState('') // Single search for title AND description
  const [filterStartDate, setFilterStartDate] = useState('') // Start date for range filter
  const [filterEndDate, setFilterEndDate] = useState('') // End date for range filter

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

  // useEffect to auto-fill date when Add Note form opens
  useEffect(() => {
    if (showAddForm && !date) {
      // Get today's date in YYYY-MM-DD format (required for input type="date")
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, '0') // Month is 0-indexed
      const day = String(today.getDate()).padStart(2, '0')
      const todayFormatted = `${year}-${month}-${day}`
      setDate(todayFormatted)
    }
  }, [showAddForm]) // Runs whenever showAddForm changes

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
    // Check if note matches search query in EITHER title OR description
    const matchesSearch = searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Date range filtering logic
    let matchesDate = true
    if (filterStartDate || filterEndDate) {
      const noteDate = new Date(note.date)

      // Check if note date is on or after start date
      if (filterStartDate) {
        const startDate = new Date(filterStartDate)
        matchesDate = matchesDate && noteDate >= startDate
      }

      // Check if note date is on or before end date
      if (filterEndDate) {
        const endDate = new Date(filterEndDate)
        matchesDate = matchesDate && noteDate <= endDate
      }
    }

    return matchesSearch && matchesDate
  })

  return (
    <Box minH="100vh" bg="gray.50" p={5}>
      <Box maxW="container.md" mx="auto">
        <Heading size="xl" mb={6} color="gray.800">
          My Notes ({notes.length}/5)
        </Heading>

        {/* Add Note Button/Form */}
        <Box mb={8}>
          <Flex gap={4} align="start">
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              colorScheme="green"
              size="md"
              minW="150px"
            >
              + Add New Note
            </Button>

            {showAddForm && (
              <Box bg="gray.50" p={6} borderRadius="lg" flex={1}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md" color="gray.600">
                    Add New Note
                  </Heading>
                  <CloseButton onClick={() => setShowAddForm(false)} />
                </Flex>

                <VStack gap={3}>
                  <Input
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    bg="white"
                  />

                  <Textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    minH="80px"
                    resize="vertical"
                    bg="white"
                  />

                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    bg="white"
                  />

                  <Button
                    onClick={addNote}
                    colorScheme="blue"
                    size="lg"
                    width="full"
                  >
                    Add Note
                  </Button>
                </VStack>
              </Box>
            )}
          </Flex>
        </Box>

        {/* Filters Button/Section */}
        <Box mb={8}>
          <Flex gap={4} align="start">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              colorScheme="purple"
              size="md"
              minW="150px"
            >
              🔍 Filter Notes
            </Button>

            {showFilters && (
              <Box bg="gray.50" p={6} borderRadius="lg" flex={1}>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md" color="gray.600">
                    Filters
                  </Heading>
                  <CloseButton onClick={() => setShowFilters(false)} />
                </Flex>

                <VStack gap={3}>
                  <Input
                    placeholder="Search notes by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    bg="white"
                  />

                  {/* Date Range Filters Section */}
                  <Box mt={2} pt={3} borderTop="1px" borderColor="gray.200" width="full">
                    <Text fontSize="sm" fontWeight="600" color="gray.600" mb={3}>
                      Filter by Date Range:
                    </Text>

                    <Flex gap={3}>
                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          Start Date
                        </Text>
                        <Input
                          type="date"
                          value={filterStartDate}
                          onChange={(e) => setFilterStartDate(e.target.value)}
                          bg="white"
                          size="sm"
                        />
                      </Box>

                      <Box flex={1}>
                        <Text fontSize="xs" color="gray.500" mb={1}>
                          End Date
                        </Text>
                        <Input
                          type="date"
                          value={filterEndDate}
                          onChange={(e) => setFilterEndDate(e.target.value)}
                          bg="white"
                          size="sm"
                        />
                      </Box>
                    </Flex>
                  </Box>
                </VStack>
              </Box>
            )}
          </Flex>
        </Box>

        {/* Notes List */}
        <Box>
          <Heading size="md" mb={4} color="gray.600">
            My Notes
          </Heading>

          {filteredNotes.length === 0 ? (
            <Text textAlign="center" color="gray.400" py={10} fontStyle="italic">
              No notes found. {notes.length > 0 ? 'Try adjusting your filters.' : 'Add your first note above!'}
            </Text>
          ) : (
            <VStack gap={4}>
              {filteredNotes.map((note, index) => (
                <Box
                  key={note.id}
                  width="full"
                  draggable
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, index)}
                  cursor="move"
                  bg="white"
                  p={2}
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="gray.200"
                  _hover={{ boxShadow: 'md' }}
                  transition="all 0.2s"
                >
                  <Flex gap={2} mb={0.5}>
                    {/* Drag Handle */}
                    <Box display="flex" alignItems="center" color="gray.400" cursor="grab">
                      <GripVertical size={16} />
                    </Box>

                    {/* Content */}
                    <Flex flex={1} justify="space-between" align="start">
                      <Heading size="sm" color="gray.800">
                        {note.title}
                      </Heading>

                      <Button
                        onClick={() => deleteNote(note.id)}
                        colorScheme="red"
                        size="sm"
                      >
                        <Trash2 size={16} style={{ marginRight: '6px' }} />
                        Delete
                      </Button>
                    </Flex>
                  </Flex>

                  {/* Description and Date */}
                  <Box ml={6}>
                    <Text color="gray.600" mb={0.5} lineHeight="short" fontSize="sm">
                      {note.description}
                    </Text>

                    <Text fontSize="xs" color="gray.400">
                      📅 {new Date(note.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                  </Box>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Box>
    </Box>
  )
}
