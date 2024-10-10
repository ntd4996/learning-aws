"use client";

import React, { useState, useRef, useEffect, RefObject } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useAxiosAuth } from "@/libs/axios";
import FullScreenDrawer from "../components/FullScreenDrawer";
import { cn } from "@nextui-org/theme";
import { Spinner } from "@nextui-org/spinner";

interface Card {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  cards: Card[];
}

interface UpdateColumnsAPI {
  (updatedColumns: Column): void;
}

const KanbanBoard: React.FC = () => {
  const { status } = useSession();

  const axiosAuth = useAxiosAuth();
  const [columns, setColumns] = useState<Column[]>([]);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const editInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [idBackground, setIdBackground] = useState("");

  useEffect(() => {
    if (editingColumn !== null || editingCard !== null) {
      editInputRef.current?.focus();
    }
  }, [editingColumn, editingCard]);

  useEffect(() => {
    if (status === "loading") return;
    const fetchColumns = async () => {
      try {
        const response = await axiosAuth.get(`/columns`);
        setColumns(response.data);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    };

    const fetchBackgroundImage = async () => {
      try {
        const response = await axiosAuth.get(`/users/get-image-background`);
        setBackgroundImage(response.data.url);
        setIdBackground(response.data.id);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching columns:", error);
      }
    };

    fetchColumns();
    fetchBackgroundImage();
  }, [axiosAuth, status]);

  const createColumnsAPI: UpdateColumnsAPI = (updatedColumns) => {
    axiosAuth
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/columns`, updatedColumns)
      .then(() => {
        console.log("API called with columns:", updatedColumns);
      })
      .catch(() => {
        console.error("Error calling API with columns:", updatedColumns);
      });
    console.log("API called with columns:", updatedColumns);
  };
  const deleteColumnsAPI = (columnId: string) => {
    axiosAuth
      .delete(`${process.env.NEXT_PUBLIC_BASE_URL}/columns/${columnId}`)
      .then(() => {
        console.log("API called with columns:", columnId);
      })
      .catch(() => {
        console.error("Error calling API with columns:", columnId);
      });
    console.log("API called with columns:", columnId);
  };
  const updateColumnsAPI: UpdateColumnsAPI = (updatedColumns) => {
    axiosAuth
      .patch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/columns/${updatedColumns.id}`,
        updatedColumns
      )
      .then(() => {
        console.log("API called with columns:", updatedColumns.id);
      })
      .catch(() => {
        console.error("Error calling API with columns:", updatedColumns.id);
      });
    console.log("API called with columns:", updatedColumns.id);
  };

  const addColumn = () => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      title: "New Column",
      cards: [],
    };
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    debouncedCreateColumnsAPI(newColumn);
  };

  const editColumnTitle = (columnId: string, newTitle: string) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    setColumns(updatedColumns);
    const columnFind = updatedColumns.find((col) => col.id === columnId);
    if (columnFind) {
      debouncedUpdateColumnsAPI(columnFind);
    }
  };

  const deleteColumn = (columnId: string) => {
    setColumns(columns.filter((col) => col.id !== columnId));
    debouncedDeleteColumnsAPI(columnId);
  };

  const addCard = (columnId: string) => {
    const newCard: Card = {
      id: `card-${Date.now()}`,
      content: "New Card",
    };
    const updatedColumns = columns.map((col) =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    );
    setColumns(updatedColumns);
    const columnFind = updatedColumns.find((col) => col.id === columnId);
    if (columnFind) {
      debouncedUpdateColumnsAPI(columnFind);
    }
  };

  const editCard = (columnId: string, cardId: string, newText: string) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId
        ? {
            ...col,
            cards: col.cards.map((card) =>
              card.id === cardId ? { ...card, content: newText } : card
            ),
          }
        : col
    );
    setColumns(updatedColumns);
    const columnFind = updatedColumns.find((col) => col.id === columnId);
    if (columnFind) {
      debouncedUpdateColumnsAPI(columnFind);
    }
  };

  const deleteCard = (columnId: string, cardId: string) => {
    const updatedColumns = columns.map((col) =>
      col.id === columnId
        ? { ...col, cards: col.cards.filter((card) => card.id !== cardId) }
        : col
    );
    setColumns(updatedColumns);
    const columnFind = updatedColumns.find((col) => col.id === columnId);
    if (columnFind) {
      debouncedUpdateColumnsAPI(columnFind);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
      return;
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId);
    const destColumn = columns.find(
      (col) => col.id === destination.droppableId
    );

    if (sourceColumn && destColumn) {
      const sourceCards = Array.from(sourceColumn.cards);
      const [removed] = sourceCards.splice(source.index, 1);
      const destCards = Array.from(destColumn.cards);
      destCards.splice(destination.index, 0, removed);

      const updatedColumns = columns.map((col) => {
        if (col.id === source.droppableId) {
          return { ...col, cards: sourceCards };
        } else if (col.id === destination.droppableId) {
          return { ...col, cards: destCards };
        } else {
          return col;
        }
      });

      setColumns(updatedColumns);
      updatedColumns.map((col) => updateColumnsAPI(col));
    }
  };

  const debouncedCreateColumnsAPI = debounce(createColumnsAPI, 500);
  const debouncedUpdateColumnsAPI = debounce(updateColumnsAPI, 500);
  const debouncedDeleteColumnsAPI = debounce(deleteColumnsAPI, 500);
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div
      className={cn(
        " bg-white min-h-screen",
        backgroundImage && "bg-cover bg-center"
      )}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex justify-center items-center mb-6 backdrop-blur-sm  p-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 flex items-center justify-center">
          Không Nest thì Next Board
        </h1>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        <div className="absolute left-4 top-4">
          <FullScreenDrawer
            setBackgroundImage={setBackgroundImage}
            idBackground={idBackground}
          />
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id} type="group">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded-lg shadow-md flex-1 min-w-[250px] max-w-[350px]"
                >
                  <div className="flex justify-between items-center mb-4">
                    {editingColumn === column.id ? (
                      <input
                        ref={editInputRef}
                        type="text"
                        value={column.title}
                        onChange={(e) =>
                          setColumns(
                            columns.map((col) =>
                              col.id === column.id
                                ? { ...col, title: e.target.value }
                                : col
                            )
                          )
                        }
                        onBlur={() => editColumnTitle(column.id, column.title)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            editColumnTitle(column.id, column.title);
                          }
                        }}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <h2
                        className="text-xl font-semibold cursor-pointer"
                        onClick={() => setEditingColumn(column.id)}
                      >
                        {column.title}
                      </h2>
                    )}
                    <button
                      onClick={() => deleteColumn(column.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      aria-label="Delete column"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {column.cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-50 p-3 mb-2 rounded border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                          {editingCard === card.id ? (
                            <input
                              ref={editInputRef}
                              type="text"
                              value={card.content}
                              onChange={(e) =>
                                setColumns(
                                  columns.map((col) =>
                                    col.id === column.id
                                      ? {
                                          ...col,
                                          cards: col.cards.map((c) =>
                                            c.id === card.id
                                              ? {
                                                  ...c,
                                                  content: e.target.value,
                                                }
                                              : c
                                          ),
                                        }
                                      : col
                                  )
                                )
                              }
                              onBlur={() =>
                                editCard(column.id, card.id, card.content)
                              }
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  editCard(column.id, card.id, card.content);
                                }
                              }}
                              className="w-full px-2 py-1 border rounded"
                            />
                          ) : (
                            <div className="flex justify-between items-start">
                              <p>{card.content}</p>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingCard(card.id)}
                                  className="text-blue-500 hover:text-blue-700 transition-colors"
                                  aria-label="Edit card"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => deleteCard(column.id, card.id)}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                  aria-label="Delete card"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <button
                    onClick={() => addCard(column.id)}
                    className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
                  >
                    <FaPlus className="mr-2" /> Add Card
                  </button>
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
        <button
          onClick={addColumn}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors flex items-center justify-center h-12"
        >
          <FaPlus className="mr-2" /> Add Column
        </button>
      </div>
    </div>
  );
};

export default KanbanBoard;
