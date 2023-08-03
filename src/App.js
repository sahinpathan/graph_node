import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_TASKS = gql`
  query {
    tasks {
      id
      text
      completed
    }
  }
`;

const ADD_TASK = gql`
  mutation AddTask($text: String!) {
    addTask(text: $text) {
      id
      text
      completed
    }
  }
`;

const MARK_TASK_COMPLETED = gql`
  mutation MarkTaskCompleted($id: ID!) {
    markTaskCompleted(id: $id) {
      id
      text
      completed
    }
  }
`;

const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      id
      text
      completed
    }
  }
`;

const UPDATE_TASK = gql`
  mutation UpdateTask($id:ID!,$text:String!,$completed:Boolean!){
    updateTask (id:$id,text:$text,completed:$completed){
      id
      text
      completed
    }
  }
`

function App() {
  const [newTaskText, setNewTaskText] = useState('');
  const { loading, error, data } = useQuery(GET_TASKS);
  const [addTask] = useMutation(ADD_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [markTaskCompleted] = useMutation(MARK_TASK_COMPLETED, {
    refetchQueries: [{ query: GET_TASKS }],
  });
  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: [{ query: GET_TASKS }],
  });

  const [updateTask] = useMutation(UPDATE_TASK,{
    refetchQueries:  [{ query: GET_TASKS }],
  })

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const tasks = data.tasks;

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      addTask({ variables: { text: newTaskText } });
      setNewTaskText('');
    }
  };

  const handleMarkCompleted = (taskId) => {
    markTaskCompleted({ variables: { id: taskId } });
  };

  const handleDeleteTask = (taskId) => {
    deleteTask({ variables: { id: taskId } });
  };
  

  const handleUpdateTask = (taskId) => {
    updateTask({variables:{id:taskId,text:"sahin",completed:true}})
  }

  return (
    <div>
      <h1>Simple To-Do List</h1>
      <div>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.completed ? 'line-through' : 'none',
              }}
            >
              {task.text}
            </span>
            {!task.completed && (
              <>
                <button onClick={() => handleMarkCompleted(task.id)}>
                  Mark Completed
                </button>
                <button onClick={() => handleUpdateTask(task.id)}>
                  Update
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
