import { useState } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import "../App.css";
import { useData } from "../state";

type Props = {
  title: string;
  listId: string;
  taskId: string;
  dragProvided: DraggableProvided;
};

function TaskCard({ listId, taskId, title, dragProvided }: Props) {
  const [editTask, setEditTask] = useState<boolean>(false);
  const [inputTitle, setInputTitle] = useState<string>(title);
  const { saveEditedTask } = useData();

  const handleEditSave = () => {
    if (inputTitle === "") return;
    //Save
    saveEditedTask(listId, taskId, inputTitle);
    setEditTask(false);
  };

  const handleFocusOut = (): void => {
    if (inputTitle === title) setEditTask(false);
  };

  if (editTask) {
    return (
      <div className="task mb-4">
        <input
          className="form-control form-control-sm mb-2"
          value={inputTitle}
          autoFocus
          onBlur={handleFocusOut}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            setInputTitle(event.target.value)
          }
          type="text"
          placeholder="Title here..."
        />
        <button
          type="button"
          className="btn btn-sm px-1 py-0"
          onClick={handleEditSave}
        >
          Save
        </button>
      </div>
    );
  } else {
    return (
      <p
        className="task"
        onDoubleClick={() => {
          setEditTask(true);
        }}
        ref={dragProvided.innerRef}
        {...dragProvided.draggableProps}
        {...dragProvided.dragHandleProps}
      >
        {title}
      </p>
    );
  }
}

export default TaskCard;
