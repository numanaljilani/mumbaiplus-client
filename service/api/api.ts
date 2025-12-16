// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "@/contants";
// import type { Pokemon } from './types'

// Define a service using a base URL and expected endpoints
export const apis = createApi({
  reducerPath: "apis",
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}/api`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.user?.token;
      console.log(token, "INSIDE TOKEN");

      if (token) {
        headers.set("Authorization", `Bearer ${token?.token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    isAvailable: builder.mutation({
      query: (args) => {
        console.log(args, ">>>>>>>");
        return {
          url: "/isAvailable",
          method: "POST",
          body: args,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    login: builder.mutation({
      query: (args) => {
        console.log(args, ">>>>>>>");
        return {
          url: "/auth/login",
          method: "POST",
          body: args,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),
    googleAuth: builder.mutation({
      query: ({ token }) => ({
        url: "auth/google",
        method: "POST",
        body: { token },
      }),
    }),
    me: builder.mutation({
      query: (args) => {
        return {
          url: "/me",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
    }),

    registerReporter: builder.mutation({
      query: (args) => {
        console.log(args, ">>>>>>>");
        return {
          url: "/auth/register",
          method: "POST",
          body: args,
          headers: {
            "Content-type": "application/json",
          },
        };
      },
    }),

    updateProfile: builder.mutation({
      query: ({ data, id }) => {
        console.log(data, "ISIDE API");
        return {
          url: `/update-with-image`,
          method: "PUT",
          body: data,

          // headers: {
          //     'Content-type': 'multipart/form-data; charset=UTF-8',
          // },
        };
      },
    }),
    uploadPost: builder.mutation({
      query: (args) => {
        console.log(args.body, ">>>>>>>");
        console.log(args.token, ">>>>>>> token");
        return {
          url: "/postimage",
          method: "POST",
          body: args.body,
          headers: {
            "Content-type": "multipart/form-data; charset=UTF-8",
            Authorization: `Bearer ${args.token}`,
          },
        };
      },
    }),

    // reportes
    // 1. GET ALL: सभी रिपोर्टर प्राप्त करें
    getReporters: builder.query({
      query: () => "reporters",
      // यहाँ परिवर्तन करें:
      transformResponse: (response) => {
        // response.data (Array) को सीधे कंपोनेंट में भेजें
        // आप यहाँ pagination मेटाडेटा को भी हैंडल कर सकते हैं यदि आवश्यक हो
        return response.data;
      },
      // ... अन्य सेटिंग्स...
    }),

    updateReporter: builder.mutation({
      /**
       * @param {{ id: string, status?: 'active' | 'suspended', isVerified?: boolean }} patch
       */
      query: ({ id, ...patch }: any) => ({
        url: `reporters/${id}`, // BASE_URL + '/reporters/{id}' पर PATCH/PUT अनुरोध
        method: "PATCH",
        body: patch,
      }),
      // सफलता पर कैश में 'Reporters' टैग को अमान्य करें,
      // ताकि getReporters query स्वचालित रूप से डेटा रिफ्रेश कर सके।
    }),

    deleteReporter: builder.mutation({
      query: (id) => ({
        url: `reporters/${id}`, // BASE_URL + '/reporters/{id}' पर DELETE अनुरोध
        method: "DELETE",
      }),
      // सफलता पर LIST टैग को अमान्य करें
    }),

    // सभी पोस्ट्स (पेंडिंग + अप्रूव्ड)
    getPosts: builder.query({
      query: ({ page = 1, search = "", status = "all", category = "all" }) =>
        `/posts?category=${category}&page=${page}&search=${search}&status=${status || "all"}`,
      // providesTags: ['Post'],
    }),
    getBreakingNews: builder.query({
      query: () => `/posts/breaking`,
      // providesTags: ['Post'],
    }),
    // सभी पोस्ट्स (पेंडिंग + अप्रूव्ड)
    getAllPosts: builder.query({
      query: ({ page = 1, search = "", status = "" }) => {
        console.log(status , "status")
        return `/posts?page=${page}&search=${search}&status=${status}`;
      },
      // providesTags: ['Post'],
    }),
    approvePost: builder.mutation({
      query: (id) => ({
        url: `/posts/admin/${id}/approve`,
        method: "PATCH",
      }),
      // invalidatesTags: ['Post'],
    }),
    // डिलीट
    deletePost: builder.mutation({
      query: (id) => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ['Post'],
    }),

    // अपडेट
    post: builder.mutation({
      query: (data) => ({
        url: `/posts`,
        method: "POST",
        body: data,
      }),
    }),
    // अपडेट
    updatePost: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body,
      }),
      // invalidatesTags: ['Post'],
    }),
    verifyPost: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/posts/${id}`,
        method: "PUT",
        body,
      }),
      // invalidatesTags: ['Post'],
    }),

    getAllEPapers: builder.query({
      query: () => `/epaper`,
    }),
    getEPaper: builder.query({
      query: (date) => `/epaper/epaper-by-date?date=${date} `,
      // providesTags: ['Post'],
    }),

    createEpaper: builder.mutation({
      query: (data) => {
        console.log(data, "DATA");
        return {
          url: `/epaper`,
          method: "POST",
          body: data,
        };
      },
    }),
    updateEpaper: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/epaper/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteEpaper: builder.mutation({
      query: (id) => ({
        url: `/epaper/${id}`,
        method: "DELETE",
      }),
      // invalidatesTags: ['Post'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpdateProfileMutation,
  useGoogleAuthMutation,

  useUploadPostMutation,
  useLoginMutation,
  useMeMutation,
  useIsAvailableMutation,

  useGetAllPostsQuery,
  useLazyGetAllPostsQuery,
  usePostMutation,
  useApprovePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
  useGetBreakingNewsQuery,
  useVerifyPostMutation,
  // Reporters
  useRegisterReporterMutation,
  useGetReportersQuery,
  useUpdateReporterMutation,
  useDeleteReporterMutation,

  // epaper
  useCreateEpaperMutation,
  useGetAllEPapersQuery,
  useGetEPaperQuery,
  useDeleteEpaperMutation,
  useGetPostsQuery,
  useUpdateEpaperMutation,
} = apis;
