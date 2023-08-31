import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const serviceApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5050/api" }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getAllServices: builder.query<Service[], void>({
      query: () => ({
        url: "/service",
        method: "GET",
      }),
      providesTags: ["Service"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetAllServicesQuery } = serviceApi;
