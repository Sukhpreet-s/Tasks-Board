import {
  DragDropContext,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  OnDragEndResponder,
  DropResult,
} from "react-beautiful-dnd";

import Droppable from "./DroppableV2";

import { useState } from "react";

import { TaskList, Task, CreateTask } from "#root/data";
import data from "#root/data";

import "./App.css";

function App() {
  const [lists, setLists]: [
    TaskList[],
    React.Dispatch<React.SetStateAction<TaskList[]>>
  ] = useState(data);

  function handleAddCardBtnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    const listIdx: string | undefined = event.currentTarget.dataset.listidx;

    if (!listIdx) return;

    // Open dialog box to add task.

    console.log("adding new list - in progress");
  }

  function handleDragEnd({ destination, source }: DropResult): void {
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    console.log("Destination: ", destination);
    console.log("Source: ", source);

    const newLists: TaskList[] = [...lists];

    // Grab the indices of the both the lists (moving from and moving to lists)
    // and use them later to move the task from one list to another.
    const moveToListIndex: number = lists.findIndex(
      (list) => destination && list.listId === destination.droppableId
    );
    const moveFromListIndex: number = lists.findIndex(
      (list) => source && list.listId === source.droppableId
    );

    // Execute the moving by removing from source list and inserting in desitation list.
    const movingTask: Task = newLists[moveFromListIndex].tasks.splice(
      source.index,
      1
    )[0];
    newLists[moveToListIndex].tasks.splice(destination.index, 0, movingTask);

    setLists(newLists);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="main">
        {lists.map((list: TaskList, index: number) => (
          <Droppable droppableId={list.listId} key={list.listId}>
            {(provided: DroppableProvided) => (
              <div
                className="tasklist"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <div className="header">
                  <h2>{list.title}</h2>
                  <button
                    className="add-task-btn"
                    type="button"
                    data-listidx={index}
                    onClick={handleAddCardBtnClick}
                  >
                    +
                  </button>
                </div>
                {list.tasks.map((task: Task, index: number) => (
                  <Draggable
                    draggableId={task.taskId}
                    index={index}
                    key={task.taskId}
                  >
                    {(dragProvided: DraggableProvided) => (
                      <p
                        className="task"
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        {...dragProvided.dragHandleProps}
                      >
                        {task.title}
                      </p>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;
