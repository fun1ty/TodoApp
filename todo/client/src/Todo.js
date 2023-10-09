import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";

const _title = styled.div`
  color: #fff;
  display: flex;
  justify-content: center;
  font-weight: 600;
  font-size: 20px;
  align-items: center;
  margin: 0;
  background-color: #6499e9;
  height: 50px;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;

const _writeDiv = styled.div`
  display: flex;
  margin-top: 5rem;
  padding-left: 2%;
  align-items: end;
`;
const _Input = styled.input`
  outline: none;
  border: none;
  border-bottom: 1px solid #6499e9;
  width: 92%;
  padding: 1%;
`;

const HiddenCheckBox = styled.input`
  appearance: none;
  width: 1.5rem;
  height: 1.5rem;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;

  &:checked {
    border-color: transparent;
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #6499e9;
  }
`;

const StyledLabel = styled.label``;

const _todoCount = styled.div`
  color: #526d82;
  font-size: 14px;
  font-weight: 700;
  margin: 2% 0 0 2%;
`;

const _ListInput = styled(_Input)`
  border-bottom: 1px solid #e3f4f4;
  width: 89%;
  padding: 1%;
`;

const _button = styled.button`
  border: 0;
  background-color: #6499e9;
  border-radius: 20%;
  width: 2rem;
  height: 2rem;
  color: #fff;
`;

const _Dbutton = styled.button`
  border: 0;
  border-radius: 20%;
  padding: 7px;
  background-color: #e3f4f4;
`;

const _li = styled.li`
  list-style-type: none;
  display: flex;
  align-items: center;
`;

const _ul = styled.ul`
  padding-left: 2%;
`;

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [inputTodo, setInputTodo] = useState("");
  const [readOnly, setReadOnly] = useState(true);
  const [todosCount, settodosCount] = useState(0);

  useEffect(() => {
    const axiosGetData = async () => {
      const res = await axios({
        method: "GET",
        url: "http://localhost:8000/todo",
      });
      console.log(res);
      const newTodos = res.data.toDoList.map((value) => ({
        id: value.id,
        title: value.title,
        done: value.done,
        checked: false,
      }));

      setTodos((prevTodos) => [...prevTodos, ...newTodos]);
    };
    axiosGetData();
  }, []);

  useEffect(() => {
    const axiosGetData = async () => {
      const res = await axios({
        method: "GET",
        url: "http://localhost:8000/todo",
      });
      settodosCount(res.data.toDoList.length);
    };
    axiosGetData();
  }, [todos]);

  const addTodo = () => {
    if (inputTodo !== "") {
      const axiosTodoUp = async () => {
        const data = {
          title: inputTodo,
          done: 0,
        };
        try {
          const res = await axios({
            method: "POST",
            url: "http://localhost:8000/todo",
            data: data,
          });
          console.log(res);
          if (res.data && res.data.data) {
            const newTodo = {
              id: res.data.id,
              title: inputTodo,
              checked: false,
              done: res.data.done,
            };
            console.log(todos);
            setTodos([...todos, newTodo]);
            setInputTodo("");
          } else {
            alert("이미 있는 목록입니다.");
          }
        } catch (error) {
          console.log(error);
        }
      };
      axiosTodoUp();
    }
  };

  const checkedTodo = (id) => {
    console.log("checkedTodo", id);
    setTodos(
      todos.map((todo) => {
        return todo.id === id
          ? { ...todo, checked: !todo.checked, done: 1 }
          : todo;
      })
    );
  };

  const removeTodo = async (id) => {
    console.log("id", id);

    try {
      const res = await axios({
        method: "DELETE",
        url: `http://localhost:8000/todo/${id}`,
      });
      if (res) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const enterkey = async (id, e) => {
    if (e.key === "Enter") {
      await editUpdateTodo(id, e.target.value);
    }
  };

  const titleChange = async (id, value) => {
    // Input 값을 변경할 때마다 로컬 상태 업데이트
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, title: value } : todo
    );
    setTodos(updatedTodos);
  };

  const editUpdateTodo = async (id, title) => {
    setReadOnly(false);
    console.log("id", id);
    const data = {
      id: id,
      title: title,
      done: 1,
    };
    try {
      const res = await axios({
        method: "PATCH",
        url: `http://localhost:8000/todo/${id}`,
        data: data,
      });
      // 편집 모드 종료 및 상태 업데이트
      if (res) {
        const updatedTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, title: title, done: 0 } : todo
        );
        setTodos(updatedTodos);
        setReadOnly(true);
      }
    } catch (error) {
      console.error("에러 발생: ", error);
    }
  };

  return (
    <>
      <_title>My Todo App</_title>
      <_writeDiv>
        <_Input
          type="text"
          value={inputTodo}
          onChange={(e) => setInputTodo(e.target.value)}
          placeholder="Add Todo here"
        />
        <_button onClick={addTodo}>+</_button>
      </_writeDiv>
      <_todoCount>🚀{todosCount} Todos</_todoCount>

      <_ul>
        {todos.map((todo) => {
          return (
            <_li key={todo.id}>
              <StyledLabel htmlFor={`custom-checkbox-${todo.id}`}>
                <HiddenCheckBox
                  type="checkbox"
                  id={`custom-checkbox-${todo.id}`}
                  checked={todo.checked}
                  onChange={() => checkedTodo(todo.id)}
                />
              </StyledLabel>
              <_ListInput
                type="text"
                value={todo.title}
                onKeyDown={(e) => enterkey(todo.id, e)}
                onChange={(e) => titleChange(todo.id, e.target.value)}
              />
              <_Dbutton onClick={() => removeTodo(todo.id)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  class="bi bi-trash3"
                  viewBox="0 0 16 16"
                >
                  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                </svg>
              </_Dbutton>
            </_li>
          );
        })}
      </_ul>
    </>
  );
}
