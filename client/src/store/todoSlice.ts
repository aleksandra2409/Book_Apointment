import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const todoApi = createApi({
  reducerPath: "todoApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5050/api" }),
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    getAllTodos: builder.query<Todo[], void>({
      query: () => ({
        url: "/todo",
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }),
      providesTags: ["Todo"],
    }),
    addTodo: builder.mutation<void, Todo>({
      query: (body) => ({
        url: "/todo",
        method: "POST",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
    editTodo: builder.mutation<void, Todo>({
      query: (body) => ({
        url: `/todo?todoId=${body._id}`,
        method: "PUT",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body,
      }),
      invalidatesTags: ["Todo"],
    }),
    deleteTodo: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/todo?todoId=${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }),
      invalidatesTags: ["Todo"],
    }),
    loginUser: builder.mutation<Token, User>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTodosQuery,
  useAddTodoMutation,
  useEditTodoMutation,
  useDeleteTodoMutation,
  useLoginUserMutation,
} = todoApi;
