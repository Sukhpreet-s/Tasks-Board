import { useState } from "react";
import { useData } from "#root/src/state";

type Props = {
  listId: string;
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
};

function NewTaskCard({ listId, setShowCard }: Props) {
  const { addNewTask, useTaskIdGenerator } = useData();
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [newTaskId, incrementTaskIdNumber] = useTaskIdGenerator();

  const handleTaskInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTaskTitle(event.target.value);
  };

  const handleFocusOut = (): void => {
    if (taskTitle === "") setShowCard(false);
  };

  const handleCancel = (): void => {
    setTaskTitle("");
    setShowCard(false);
  };

  const handleTaskSave = (): void => {
    addNewTask(listId, newTaskId, taskTitle);
    incrementTaskIdNumber(); // Increment task number after using it
    setShowCard(false);
  };

  return (
    <div className="task" onBlur={handleFocusOut}>
      <input
        type="text"
        placeholder="Title here..."
        className="form-control form-control-sm mb-2"
        value={taskTitle}
        autoFocus
        onInput={handleTaskInput}
      />
      <button
        type="button"
        className="btn btn-sm px-1 py-0"
        onClick={handleTaskSave}
      >
        Save
      </button>
      <button
        type="button"
        className="btn btn-sm px-1 py-0 ms-2"
        onClick={handleCancel}
      >
        Cancel
      </button>
    </div>
  );
}

export default NewTaskCard;
