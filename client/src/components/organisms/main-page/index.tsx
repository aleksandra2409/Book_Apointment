import { FC, useState, ChangeEvent, useMemo } from "react";
import { debounce } from "lodash";

import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";

import { StyledGrid } from "./main-page.style";

import { FooterBlock, HeaderBlock, ServiceCard } from "../../molecules";
import { ServiceModal } from "../reservation-modal";
import { useGetAllServicesQuery } from "../../../store/serviceSlice";
import { UserModal } from "../user-modal";

export const MainPage: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUserOpen, setIsUserOpen] = useState<boolean>(false);
  const [activeService, setActiveService] = useState<Service | null>(null); // active service for reservation
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const { data, error } = useGetAllServicesQuery(); // fetch data from server

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return data?.filter(
      (service) =>
        service.serviceName.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedStatus === "All" || service.category === selectedStatus)
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

  // Function to handle reservation modal open/close
  const handleModalOpen = (service: Service | null) => {
    setIsOpen(!isOpen);
    setActiveService(service);
  };

  // Function to handle user modal open/close
  const handleUserModalOpen = () => {
    setIsUserOpen(!isUserOpen);
  };

  return (
    <>
      <HeaderBlock
        leftSlot={[
          <Button
            key={"Add Button"}
            variant="contained"
            color="primary"
            onClick={() => handleUserModalOpen()}
          >
            My Reservations
          </Button>,
        ]}
        centerSlot={[
          <TextField
            key={"Search Input"}
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            onChange={handleInputChange}
          />,
        ]}
        rightSlot={[
          <FormControl sx={{ width: "200px" }} key={"Status Select"}>
            <InputLabel id="status-select-label">Category</InputLabel>
            <Select
              labelId="status-select-label"
              id="status-select"
              label="Status"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <MenuItem value={"All"}>All</MenuItem>
              <MenuItem value={"Face care"}>Face care</MenuItem>
              <MenuItem value={"Body care"}>Body care</MenuItem>
              <MenuItem value={"Eyebrow tattooing"}>Eyebrow tattooing</MenuItem>
              <MenuItem value={"Hairstyling"}>Hairstyling</MenuItem>
            </Select>
          </FormControl>,
        ]}
      />
      <StyledGrid container>
        {filteredData?.map((item) => (
          <ServiceCard
            service={item}
            onClick={handleModalOpen}
            key={item._id}
          />
        ))}
      </StyledGrid>
      <FooterBlock
        leftSlot={[
          <Typography
            sx={{ fontSize: 20, fontWeight: "700" }}
            color="primary.main"
            gutterBottom
            key="adress"
          >
            Strahinjica Bana 53, Beograd
          </Typography>,
        ]}
        centerSlot={[
          <Typography
            sx={{ fontSize: 20, fontWeight: "700" }}
            color="primary.main"
            gutterBottom
            key="worktime"
          >
            Mon - Fri 10:00 - 20:00
          </Typography>,
        ]}
        rightSlot={[
          <Typography
            sx={{ fontSize: 20, fontWeight: "700" }}
            color="primary.main"
            gutterBottom
            key="number"
          >
            061/11 12 113
          </Typography>,
          <Typography
            sx={{ fontSize: 20, fontWeight: "700" }}
            color="primary.main"
            gutterBottom
            key="email"
          >
            beauty.salon@gmail.com
          </Typography>,
        ]}
      />
      <ServiceModal
        open={isOpen}
        handleModalOpen={handleModalOpen}
        activeService={activeService}
      />
      <UserModal open={isUserOpen} handleModalOpen={handleUserModalOpen} />
    </>
  );
};
