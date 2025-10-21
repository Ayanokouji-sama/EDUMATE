const DB_NAME = 'EdumateDB'
const DB_VERSION = 1
const STORE_NAME = 'contents'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      reject('Database failed to open')
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { 
          keyPath: 'id', 
          autoIncrement: true 
        })
        objectStore.createIndex('timestamp', 'timestamp', { unique: false })
        objectStore.createIndex('type', 'type', { unique: false })
        console.log('Database setup complete')
      }
    }
  })
}


export async function saveContent(data) {
  try {
    const db = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      const request = objectStore.add(data)
      
      request.onsuccess = () => {
        console.log('Content saved with ID:', request.result)
        resolve({ id: request.result, ...data })
      }
      
      request.onerror = () => {
        reject('Failed to save content')
      }
    })
  } catch (error) {
    console.error('Error saving content:', error)
    throw error
  }
}
export async function getAllContent() {
  try {
    const db = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      const request = objectStore.getAll()
      
      request.onsuccess = () => {
        resolve(request.result)
      }
      
      request.onerror = () => {
        reject('Failed to fetch content')
      }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
}
export async function getContentById(id) {
  try {
    const db = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      const request = objectStore.get(id)
      
      request.onsuccess = () => {
        resolve(request.result)
      }
      
      request.onerror = () => {
        reject('Failed to fetch content')
      }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    throw error
  }
}
export async function deleteContent(id) {
  try {
    const db = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      const request = objectStore.delete(id)
      
      request.onsuccess = () => {
        console.log('Content deleted:', id)
        resolve()
      }
      
      request.onerror = () => {
        reject('Failed to delete content')
      }
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    throw error
  }
}
export async function clearAllContent() {
  try {
    const db = await openDB()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const objectStore = transaction.objectStore(STORE_NAME)
      
      const request = objectStore.clear()
      
      request.onsuccess = () => {
        console.log('All content cleared')
        resolve()
      }
      
      request.onerror = () => {
        reject('Failed to clear content')
      }
    })
  } catch (error) {
    console.error('Error clearing content:', error)
    throw error
  }
}