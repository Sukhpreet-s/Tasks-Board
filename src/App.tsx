import {
  DragDropContext,
  DroppableProvided,
  DropResult,
  OnDragEndResponder,
} from "react-beautiful-dnd";
import Droppable from "./DroppableV2";
import { useData } from "#root/src/state";
import TaskList from "#root/src/components/TaskList";

function App() {
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
              <TaskList
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

export default App;
