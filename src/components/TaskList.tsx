import { Task } from "#root/data";
import TaskCard from "./TaskCard";
import { useData } from "#root/src/state";

import "../App.css";
import { useState } from "react";
import NewTaskCard from "./NewTaskCard";
import {
  DroppableProvided,
  DragDropContext,
  OnDragEndResponder,
  DropResult,
  Draggable,
  DraggableProvided,
} from "react-beautiful-dnd";
import Droppable from "#root/src/DroppableV2";

type Props = {
  listId: string;
  title: string;
  tasks: Record<string, Task>;
  droppableProvided: DroppableProvided;
};

function TaskListComponent({ listId, title, tasks, droppableProvided }: Props) {
  const [addTaskCard, setAddTaskCard] = useState<boolean>(false);

  const handleShowNewTask = (): void => {
    setAddTaskCard(true);
  };

  return (
    <div
      className="tasklist me-2"
      {...droppableProvided.droppableProps}
      ref={droppableProvided.innerRef}
    >
      <div className="header">
        <h2>{title}</h2>
        <button
          className="add-task-btn"
          type="button"
          onClick={handleShowNewTask}
        >
          +
        </button>
      </div>

      {Object.entries(tasks).map(([taskId, task], index) => (
        <Draggable draggableId={taskId} index={index} key={taskId}>
          {(dragProvided: DraggableProvided) => (
            <TaskCard
              key={taskId}
              listId={listId}
              taskId={taskId}
              title={task.title}
              dragProvided={dragProvided}
            />
          )}
        </Draggable>
      ))}

      {addTaskCard && (
        <NewTaskCard listId={listId} setShowCard={setAddTaskCard} />
      )}

      {droppableProvided.placeholder}
    </div>
  );
}

export default function TestApp() {
  const { state, moveTask } = useData();

  const handleDragEnd: OnDragEndResponder = ({
    destination,
    source,
  }: DropResult) => {
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;
    console.log(destination, source);

    const from = {
      listId: source.droppableId,
      index: source.index,
    };

    const to = {
      listId: destination.droppableId,
      index: destination.index,
    };

    moveTask(from, to);
  };

  return (
    <div className="d-flex align-items-start">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(state).map(([listId, list]) => (
          <Droppable droppableId={listId} key={listId}>
            {(provided: DroppableProvided) => (
              <TaskListComponent
                droppableProvided={provided}
                key={listId}
                listId={listId}
                title={list.title}
                tasks={list.tasks}
              />
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}
