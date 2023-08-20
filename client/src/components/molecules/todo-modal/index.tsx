import { FC, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Dialog,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  Typography,
  Button,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import { StyledContainer } from "./todo-modal.style";

import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
} from "../../../store/todoSlice";

interface ToDoModalProps {
  open: boolean;
  edit: boolean;
  handleModalOpen: (open: boolean, todo: null) => void;
  activeTodo: Todo | null;
  setToken: (token: string | null) => void;
}

export const ToDoModal: FC<ToDoModalProps> = ({
  open,
  edit,
  handleModalOpen,
  activeTodo,
  setToken
}) => {
  const { register, handleSubmit, control, reset, setValue } = useForm<Todo>();

  const navigate = useNavigate();

  const [saveTodoData, { error: addError }] = useAddTodoMutation();

  const [editTodoData, { error: editError }] = useEditTodoMutation();

  const [deleteTododata, { error: deleteError }] = useDeleteTodoMutation();

  // Error handling for unauthorized access
  if (addError && "status" in addError && addError?.status === 401) {
    sessionStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  if (editError && "status" in editError && editError?.status === 401) {
    sessionStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  if (deleteError && "status" in deleteError && deleteError?.status === 401) {
    sessionStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  const handleAddToDo = async (data: Todo) => {
    try {
      await saveTodoData(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditToDo = async (data: Todo) => {
    if (activeTodo) {
      const finalData = {
        ...data,
        _id: activeTodo._id,
      };
      try {
        await editTodoData(finalData);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDeleteToDo = async () => {
    if (activeTodo) {
      try {
        await deleteTododata(activeTodo._id);
      } catch (error) {
        console.log(error);
      }
    }
    onClose();
  };

  const onClose = () => {
    handleModalOpen(false, null);
    reset({
      title: "",
      status: "New",
      priority: 0,
    });
  };

  const onSubmit: SubmitHandler<Todo> = (data: Todo) => {
    edit ? handleEditToDo(data) : handleAddToDo(data);
    onClose();
  };

  useEffect(() => {
    if (edit && activeTodo) {
      setValue("title", activeTodo.title);
      setValue("status", activeTodo.status);
      setValue("priority", activeTodo.priority);
    } else {
      reset({
        title: "",
        status: "New",
        priority: 0,
      });
    }
  }, [activeTodo]);

  return (
    <Dialog open={open} onClose={onClose}>
      <Container
        sx={{
          padding: "16px !important",
          borderBottom: "1px solid #D7E1E4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontSize: 20 }} color="primary.main" gutterBottom>
          {edit ? "Edit Task" : "Add Task"}
        </Typography>
      </Container>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledContainer>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            fullWidth
            required
            {...register("title", { required: true })}
          />
          <FormControl fullWidth>
            <InputLabel id="status-select-label" required>
              Status
            </InputLabel>
            <Controller
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="status-select-label"
                  id="status-select"
                  label="Status"
                  required
                >
                  <MenuItem value={"New"}>New</MenuItem>
                  <MenuItem value={"InProgress"}>In Progress</MenuItem>
                  <MenuItem value={"Done"}>Done</MenuItem>
                </Select>
              )}
              name={"status"}
              control={control}
              defaultValue={"New"}
            />
          </FormControl>
          <Typography
            variant="body2"
            color="secondary.main"
            sx={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            Priority
            <br />
            <Controller
              name="priority"
              control={control}
              defaultValue={0}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Rating
                  name="priority"
                  onChange={onChange}
                  value={Number(value)}
                  icon={<LocalFireDepartmentIcon />}
                  emptyIcon={<LocalFireDepartmentIcon />}
                />
              )}
            />
          </Typography>

          <Container
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: edit ? "space-between" : "center",
            }}
          >
            <Button
              size="medium"
              variant="contained"
              color="primary"
              type="submit"
            >
              {edit ? "Edit" : "Add"}
            </Button>
            {edit && (
              <Button
                size="medium"
                variant="outlined"
                color="primary"
                onClick={handleDeleteToDo}
              >
                Delete
              </Button>
            )}
          </Container>
        </StyledContainer>
      </form>
    </Dialog>
  );
};
