interface Todo {
  _id: string;
  title: string;
  status: "New" | "InProgress" | "Done";
  priority: number;
}
interface User {
  user: string;
  password: string;
}
interface Token {
    token: string;
}
