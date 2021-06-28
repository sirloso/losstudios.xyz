import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiBaseEndpoint,apiEndpointExtentions } from '../values'
import { Work } from './workSlice'

export const workApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseEndpoint }),
  endpoints: (build) => ({
    //              ResultType  QueryArg
    //                    v       v
    getWorks: build.query<Work[],any>({
      // inferred as `number` from the `QueryArg` type
      //       v
      query: () => apiEndpointExtentions.works,
      // An explicit type must be provided to the raw result that the query returns
      // when using `transformResponse`
      //                                  contains req, and res objects 
      //                                             v 
      transformResponse: (rawResult:  ApiResponse , meta) => {
        return rawResult
      },
    }),
  }),
})

export const { useGetWorksQuery } = workApi


export type ApiResponse = Array<WorkCMSSchema>

export interface WorkCMSSchema{
  id: number
  Title: string
  Body: string
  Gallery: Array<Gallery>
}

export interface Gallery{
  id: number
  name: string
  formats: {
    thumbnail?:Photo
    large?: Photo
    medium?: Photo
    small?: Photo
  }
}

export interface Photo{
  name: string
  url: string
}