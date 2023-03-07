import {
  DragDropContext,
  Draggable,
  DroppableProvided,
  DraggableProvided,
  OnDragEndResponder,
  DropResult,
} from "react-beautiful-dnd";

import Droppable from "./DroppableV2";

import React, {
  useState,
  useRef,
  createRef,
  RefObject,
  useEffect,
} from "react";

import { TaskList, Task, TASK_NUMBER, incrementTaskNumber } from "#root/data";
import data from "#root/data";

import "./App.css";

const ACTION_TYPE = {
  ADD: "add",
  EDIT: "edit",
};

function App() {
  // States
  const [lists, setLists]: [
    TaskList[],
    React.Dispatch<React.SetStateAction<TaskList[]>>
  ] = useState(data);

  const [createTaskCardListIdx, setCreateTaskCardListIdx]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(NaN);

  const [taskIdx, setTaskIdx]: [
    number,
    React.Dispatch<React.SetStateAction<number>>
  ] = useState(NaN);

  const [newTaskTitle, setNewTaskTitle]: [
    string,
    React.Dispatch<React.SetStateAction<string>>
  ] = useState("");

  const [isEditTask, setIsEditTask]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const [isAddTask, setIsAddTask]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState(false);

  const inputRefs: React.MutableRefObject<RefObject<HTMLInputElement>[]> =
    useRef(lists.map(() => createRef()));

  // Effects
  useEffect(() => {
    if (isNaN(createTaskCardListIdx)) return;
    inputRefs.current[createTaskCardListIdx].current?.focus();
  }, [createTaskCardListIdx]);

  // Functions
  /**
   * Save the task to the list.
   */
  const addTask = (listIdx: number): void => {
    const newTask: Task = {
      taskId: `task-${TASK_NUMBER}`,
      title: newTaskTitle,
    };

    const newLists: TaskList[] = [...lists];
    newLists[listIdx].tasks.push(newTask);

    setLists(newLists);
  };

  const editExistingTask = (listIdx: number, taskIdx: number): void => {
    const task: Task = lists[listIdx].tasks[taskIdx];
    task.title = newTaskTitle;

    const newLists: TaskList[] = [...lists];
    newLists[listIdx].tasks.splice(taskIdx, 1, task);

    setLists(newLists);
  };

  // Event handlers

  /**
   * Display the task card in a specified list.
   */
  function handleAddCardBtnClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    const listIdx: number | undefined = Number(
      event.currentTarget.dataset.listidx
    );

    if (isNaN(listIdx)) return;

    setCreateTaskCardListIdx(listIdx);
    setIsAddTask(true);
  }

  /**
   * Save task when event triggered (Save button, input box blur event)
   */
  function handleTaskSave(event: React.MouseEvent<HTMLButtonElement>): void {
    event.preventDefault();

    const listIdx: number = Number(event.currentTarget.dataset.listidx);
    if (isNaN(listIdx)) return;

    const taskIdx: number = Number(event.currentTarget.dataset.taskidx);

    const actionType: string | undefined =
      event.currentTarget.dataset.actiontype!;

    handleSave(actionType, listIdx, taskIdx);
  }

  /**
   * Drag element from one list to another.
   */
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

  /**
   * Save or Clear the task card on blur event on input box.
   */
  const handleFocusOut = (event: React.FocusEvent<HTMLInputElement>): void => {
    const listIdx: number = Number(event.currentTarget.dataset.listidx);
    if (isNaN(listIdx)) return;

    const taskIdx: number = Number(event.currentTarget.dataset.taskidx);

    const actionType: string | undefined =
      event.currentTarget.dataset.actiontype!;

    handleSave(actionType, listIdx, taskIdx);
  };

  const handleSave = (actionType: string, listIdx: number, taskIdx: number) => {
    switch (actionType) {
      case ACTION_TYPE.ADD:
        // Clear the task.
        if (newTaskTitle === "") {
          setCreateTaskCardListIdx(NaN);
          setIsAddTask(false);
          return;
        }

        // Save the task.
        addTask(listIdx);

        setCreateTaskCardListIdx(NaN);
        setNewTaskTitle("");
        setIsAddTask(false);
        incrementTaskNumber();
        break;

      case ACTION_TYPE.EDIT:
        if (newTaskTitle === "") {
          setTaskIdx(NaN);
          setCreateTaskCardListIdx(NaN);
          setIsEditTask(false);
          return;
        }

        // Edit the task
        if (isNaN(taskIdx)) return;
        editExistingTask(listIdx, taskIdx);

        setTaskIdx(NaN);
        setNewTaskTitle("");
        setCreateTaskCardListIdx(NaN);
        setIsEditTask(false);
    }
  };

  return (
    <main>
      {newTaskTitle}
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
                  {list.tasks.map((task: Task, taskIndex: number) => (
                    <Draggable
                      draggableId={task.taskId}
                      index={taskIndex}
                      key={task.taskId}
                    >
                      {(dragProvided: DraggableProvided) =>
                        isEditTask &&
                        taskIdx === taskIndex &&
                        index === createTaskCardListIdx ? (
                          <div className="task mb-4">
                            <input
                              className="form-control form-control-sm mb-2"
                              value={newTaskTitle}
                              data-listidx={index}
                              data-taskidx={taskIndex}
                              data-actiontype={ACTION_TYPE.EDIT}
                              autoFocus
                              onBlur={handleFocusOut}
                              onInput={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => setNewTaskTitle(event.target.value)}
                              type="text"
                              placeholder="Title here..."
                            />
                            <button
                              type="button"
                              data-listidx={index}
                              data-taskidx={taskIndex}
                              data-actiontype={ACTION_TYPE.EDIT}
                              className="btn btn-sm px-1 py-0"
                              onClick={handleTaskSave}
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <p
                            className="task"
                            onDoubleClick={() => {
                              setIsEditTask(true);
                              setTaskIdx(taskIndex);
                              setCreateTaskCardListIdx(index);
                              setNewTaskTitle(task.title);
                            }}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                          >
                            {task.title}
                          </p>
                        )
                      }
                    </Draggable>
                  ))}
                  <div
                    className={`task ${
                      createTaskCardListIdx === index && isAddTask ? "" : "hide"
                    }`}
                  >
                    <input
                      className="form-control form-control-sm mb-2"
                      value={newTaskTitle}
                      ref={inputRefs.current[index]}
                      data-actiontype={ACTION_TYPE.ADD}
                      data-listidx={index}
                      onBlur={handleFocusOut}
                      onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setNewTaskTitle(event.target.value)
                      }
                      type="text"
                      placeholder="Title here..."
                    />
                    <button
                      type="button"
                      data-listidx={index}
                      data-actiontype={ACTION_TYPE.ADD}
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
