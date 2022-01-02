import Header from "./components/Header";
import Tasks from "./components/Tasks";
import { useState, useEffect } from 'react';
import { BrowserRouter as Router,Routes, Route  } from 'react-router-dom';
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
import TaskDetails from "./components/TaskDetails";

function App() {
  const [showAddTask, setShowAddTask] = useState(false)


  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }
    getTasks()
  }, [])

  // Fetch tasks from server
  const fetchTasks = async () => {
      const res = await fetch('http://localhost:3001/tasks')
      const data = await res.json()
      
    return data
  }

  // Fetch task from server
  const fetchTask = async (id) => {
      const res = await fetch(`http://localhost:3001/tasks/${id}`)
      const data = await res.json()
      
      return data
  }

  // Delete Task
  const deleteTask = async (id) => {
    const res = await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'DELETE',
    })
    //We should control the response status to decide if we will change the state or not.
    res.status === 200
      ? setTasks(tasks.filter((task) => task.id !== id))
      : alert('Error Deleting This Task')
  }

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    
    const res = await fetch(`http://localhost:3001/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-type': 'application/json'},
      body: JSON.stringify(updTask)

    }) 
    const data = await res.json()
    setTasks(
      tasks.map((task) => task.id === id
        ? { ...task, reminder: data.reminder } : task)
    )
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:3001/tasks', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(task),
    })

    const data = await res.json()

    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])
  }
  
  return (
    <Router>
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAddTask={ showAddTask}/>
        <Routes>
          <Route path="/" exact element={
            <>
              {showAddTask && <AddTask onAdd={addTask} />}
              {tasks.length > 0 ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : 'No Tasks'}
            </>
          } />
          <Route path="/about" element={<About />} />
          <Route path="/task/:id" element={<TaskDetails/>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
