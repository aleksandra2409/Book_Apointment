import { FC, useState, ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { StyledGrid } from './main-page.style';

import {
  HeaderBlock,
  MobileHeaderBlock,
  Sticky,
  ToDoModal,
} from "../../molecules";
import { MobileButton } from "../../atoms";
import { useGetAllTodosQuery } from "../../../store/todoSlice";

import { PAGE_SIZE } from "./main-page.constants";

interface MainPageProps {
  setToken: (token: string | null) => void;
}

export const MainPage: FC<MainPageProps> = ({setToken}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null); // active todo for edit
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);


  const navigate = useNavigate();

  const { data, error } = useGetAllTodosQuery(); // fetch data from server

  // Authorization error handling
  if (error && "status" in error && error?.status === 401) {
    sessionStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return data?.filter(
      (todo) =>
        todo.title.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedStatus === "All" || todo.status === selectedStatus)
    );
  }, [data, searchText, selectedStatus]); 

  // Function to handle search input change with debounce
  const handleInputChange = debounce((e: ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchText(searchText);
  }, 100); 

  // Function to handle status change
  const handleStatusChange = (e: any) => {
    const category = e.target.value;
    setSelectedStatus(category);
  }; 

  // Function to handle modal open/close
  const handleModalOpen = (edit: boolean, todo: Todo | null) => {
    setIsOpen(!isOpen);
    setIsEdit(edit);
    setActiveTodo(todo);
  }; 

  // Pagination logic
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const totalTodos = filteredData?.length ?? 0;
  const totalPages = Math.ceil(totalTodos / PAGE_SIZE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedData = useMemo(() => {
    return filteredData?.slice(startIndex, endIndex);
  }, [data, searchText, selectedStatus, currentPage]); // memoized filtered data

  return (
    <>
      <HeaderBlock
        leftSlot={[
          <Button
            key={"Add Button"}
            variant="contained"
            color="primary"
            onClick={() => handleModalOpen(false, null)}
            endIcon={<AddIcon />}
          >
            Add Task
          </Button>,
        ]}
        centerSlot={[
          <IconButton
            key={"Previous Page"}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowBackIosIcon />
          </IconButton>,
          <TextField
            key={"Search Input"}
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />,
          <IconButton
            key={"Next Page"}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowForwardIosIcon />
          </IconButton>,
        ]}
        rightSlot={[
          <FormControl sx={{ width: "200px" }} key={"Status Select"}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              label="Status"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"New"}>New</MenuItem>
              <MenuItem value={"InProgress"}>In Progress</MenuItem>
              <MenuItem value={"Done"}>Done</MenuItem>
            </Select>
          </FormControl>,
        ]}
      />
      <MobileHeaderBlock
        leftSlot={[
          <IconButton
            key={"Previous Page mobile"}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ArrowBackIosIcon />
          </IconButton>,
        ]}
        rightSlot={[
          <IconButton
            key={"Next Page mobile"}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowForwardIosIcon />
          </IconButton>,
        ]}
      />
      <StyledGrid container>
        {paginatedData?.map((item) => (
          <Sticky item={item} onClick={handleModalOpen} key={item._id} />
        ))}
      </StyledGrid>
      <MobileButton onClick={() => handleModalOpen(false, null)} />
      <ToDoModal
        open={isOpen}
        handleModalOpen={handleModalOpen}
        edit={isEdit}
        activeTodo={activeTodo}
        setToken={setToken}
      />
    </>
  );
};
