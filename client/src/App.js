import './index.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import shortid from 'shortid';
import e from 'cors';

const App = () => {

  const [socket, setSocket] = useState(null);
  const [tasks, setTask] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io.connect('http://localhost:8080', {
      transports: ['websocket'],
    })
    setSocket(socket);

    socket.on('updateData', (tasksData) => updateTask(tasksData));
    socket.on('addTask', (newTask) => {addTask(newTask)});
    socket.on('removeTask', (taskId) => removeTask(e, taskId, false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateTask = (tasksData) => {
    setTask(tasksData);
  };

  const removeTask = (e, taskId, local) => {
    setTask((tasks) => tasks.filter(task => task.id !== taskId));
    if (local === true)  socket.emit('removeTask', taskId );
  };

  const submitForm = (e) => {
    e.preventDefault();
    const inputTask = { name: taskName, id: shortid() }
    if(inputTask.name === '') { alert ('Field cant be empty...') 
      } else {
    addTask(inputTask)
    socket.emit('addTask', inputTask);
    setTaskName('');
    }
  };

  const addTask = (data) => {setTask(tasks => [...tasks, data])};

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((item) => (<li key={shortid()} className="task">{item.name}
              <button onClick={() => removeTask(e, item.id, true)} className="btn btn--red">Remove</button></li>))
          }
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" value={taskName} type="text" placeholder="Type your description"
            id="task-name" onChange={e => setTaskName(e.target.value)} />
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;