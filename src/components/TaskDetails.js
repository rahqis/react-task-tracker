import { useState, useEffect } from "react"
import { useParams, useNavigate } from 'react-router-dom';
import Button from "./Button";
import Tasks from "./Tasks";


function TaskDetails() {
    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState({})
    const [error, setError] = useState(null)
    
    const params = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            const res = await fetch(`http://localhost:3001/tasks/${params.id}`)
            const data = await res.json()

            if (res.status === 404) {
                navigate("/")
            }

            setTask(data)
            setLoading(false)
        }

        fetchTask()
    }) 

    return loading ? (
        <h3>Loading...</h3>
    ) : (
            <div align="center">
                <h3>{task.text}</h3>
                <p>{task.time}</p>
                <Button color="primary" text="Back to Tasks" onClick={()=> {{navigate(-1)}}}/>
            </div>
    )
}

export default TaskDetails
