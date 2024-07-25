import { type FormEvent, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CustomizedTables from '../Table';
import 'react-toastify/dist/ReactToastify.min.css';
import DefaultForm from '../DefaultForm';
import EditForm from '../EditForm';

interface Task {
  task: string;
  id: number;
}

export default function Body() {
  const [tasks, setTasks] = useState<string[]>(() => {
    const savedTasks = localStorage.getItem('tarefas');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [isEditingTask, setIsEditingTask] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<string>('');
  const [editedTaskValue, setEditedTaskValue] = useState<Task>({
    task: '',
    id: 0,
  });

  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tasks));
  }, [tasks]);

  function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const taskValue = data.get('task')?.toString().trim();
    if (!taskValue) {
      toast.error('Tarefa não inserida');
      return;
    }
    event.currentTarget.reset();
    setTasks([...tasks, taskValue]);
    toast.success('Tarefa inserida com sucesso');
  }

  function deleteTask(taskToDelete: string) {
    const taskIndex = tasks.findIndex((task) => task === taskToDelete);
    console.log(taskIndex);

    if (taskIndex === -1) {
      const newTaskList = tasks.filter((task) => task !== taskToDelete);
      setTasks(newTaskList);
    } else {
      const newTaskList = [...tasks];
      newTaskList.splice(taskIndex, 1);
      setTasks(newTaskList);
    }
    toast.warn(`Você removeu a tarefa "${taskToDelete}"`);
    setIsEditingTask(false);
    return;
  }

  function editTask(editTask: string, taskIndex: number) {
    setIsEditingTask(true);
    setTaskToEdit(editTask);
    setEditedTaskValue({ task: editTask, id: taskIndex });
    toast.warn(`Você está editando a tarefa "${editTask}"`);
  }

  function saveEditedTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const taskValue = data.get('task')?.toString().trim();

    if (!taskValue) {
      toast.error('Tarefa não atualizada');
      return;
    }

    const updatedTasks = tasks.map((task, index) =>
      index === editedTaskValue.id ? taskValue : task,
    );

    event.currentTarget.reset();
    setTasks(updatedTasks);
    toast.success('Tarefa editada com sucesso');
    setIsEditingTask(false);
  }

  return (
    <div>
      <div
        className="p-4 bg-white rounded-lg shadow sm:p-6 md:p-8
          mx-auto max-w-full size-max mt-8 outline outline-zinc-400"
      >
        {!isEditingTask ? (
          <DefaultForm
            saveTask={saveTask}
            tasks={tasks}
            deleteTask={deleteTask}
            editTask={editTask}
          />
        ) : (
          <EditForm
            saveEditedTask={saveEditedTask}
            taskToEdit={taskToEdit}
            editedTaskValue={editedTaskValue}
          />
        )}
        <CustomizedTables
          tasks={tasks}
          deleteTask={deleteTask}
          editTask={editTask}
          isEditingTask={isEditingTask}
        />
      </div>
      <ToastContainer autoClose={3500} />
    </div>
  );
}
