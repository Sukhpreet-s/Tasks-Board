import {
  DragDropContext,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  OnDragEndResponder,
  DropResult,
} from "react-beautiful-dnd";

import Droppable from "./DroppableV2";

import { useState, useRef, createRef, RefObject } from "react";

import { TaskList, Task, TASK_NUMBER, incrementTaskNumber } from "#root/data";
import data from "#root/data";

import "./App.css";

function App() {
  // States
  const [lists, setLists]: [
    TaskList[],
    React.Dispatch<React.SetStateAction<TaskList[]>>
  ] = useState(data);

  const [createTaskCardListId, setCreateTaskCardListId]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("");

  const [newTaskTitle, setNewTaskTitle]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("");

  const inputRefs: React.MutableRefObject<RefObject<HTMLInputElement>[]> =
    useRef(lists.map(() => createRef()));

  // Functions
  const addTask = (listIdx: number): void => {
    const newTask: Task = {
      taskId: `task-${TASK_NUMBER}`,
      title: newTaskTitle,
    };

    const newLists: TaskList[] = [...lists];
    newLists[listIdx].tasks.push(newTask);

    setLists(newLists);

    setCreateTaskCardListId("");
    setNewTaskTitle("");

    incrementTaskNumber();
  };

  // Event handlers
  function handleAddCardBtnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    const listId: string | undefined = event.currentTarget.dataset.listid;

    if (!listId) return;

    setCreateTaskCardListId(listId);

    console.log("input ref: ", inputRefs);
    const listIdx: number = Number(event.currentTarget.dataset.listidx);
    if (isNaN(listIdx)) return;
    const inputEle: HTMLInputElement = inputRefs.current[listIdx].current!;
    console.log("current ref: ", inputEle);
    // inputEle.focus();
  }

  function handleTaskSave(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    const listIdx: number = Number(event.currentTarget.dataset.listidx);
    if (isNaN(listIdx)) return;

    if (newTaskTitle === "") return;
    addTask(listIdx);
  }

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
  };

  const handleFocusOut = (event: React.FocusEvent<HTMLInputElement>): void => {
    const listIdx: number = Number(event.currentTarget.dataset.listidx);
    if (isNaN(listIdx)) return;

    if (newTaskTitle === "") {
      setCreateTaskCardListId("");
      return;
    }

    addTask(listIdx);
  };

  return (
    <main>
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
                      data-listid={list.listId}
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
                  <div
                    className={`task ${
                      createTaskCardListId === list.listId ? "" : "hide"
                    }`}
                  >
                    <input
                      className="form-control form-control-sm mb-2"
                      value={newTaskTitle}
                      ref={inputRefs.current[index]}
                      data-listidx={index}
                      onBlur={handleFocusOut}
                      onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTaskTitle(event.target.value)
                      }
                      onFocus={() => console.log("Input focused!!!")}
                      type="text"
                      placeholder="Title here..."
                    />
                    <button
                      type="button"
                      data-listidx={index}
                      className="btn btn-sm px-1 py-0"
                      onClick={handleTaskSave}
                    >
                      Save
                    </button>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </main>
  );
}

export default App;
