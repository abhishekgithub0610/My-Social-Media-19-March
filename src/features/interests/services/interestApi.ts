import { baseClient } from "@/shared/api/baseClient";
import { ApiResponseResult } from "@/types/api";

import {
  InterestDto,
  MyInterestsDto,
  SuggestedPageDto,
  SuggestedPostDto,
} from "@/features/interests/types/interest";

export const getInterests = async (): Promise<
  ApiResponseResult<InterestDto[]>
> => {
  const response = await baseClient.get("/interests");
  return response.data;
};

export const getMyInterests = async (): Promise<
  ApiResponseResult<MyInterestsDto>
> => {
  const response = await baseClient.get("/interests/me");
  return response.data;
};

export const saveMyInterests = async (
  interestIds: string[],
): Promise<ApiResponseResult<MyInterestsDto>> => {
  const response = await baseClient.put("/interests/me", {
    interestIds,
  });

  return response.data;
};

export const getSuggestedPages = async (
  take: number = 12,
): Promise<ApiResponseResult<SuggestedPageDto[]>> => {
  const response = await baseClient.get(
    `/interests/suggested-pages?take=${take}`,
  );

  return response.data;
};

export const getSuggestedPosts = async (
  take: number = 12,
): Promise<ApiResponseResult<SuggestedPostDto[]>> => {
  const response = await baseClient.get(
    `/interests/suggested-posts?take=${take}`,
  );

  return response.data;
};
