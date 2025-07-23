import { postResponse } from "@/api/responseApi";
import { useMutation } from "@tanstack/react-query";


export const usePostResponse = () =>
  useMutation({ mutationFn: postResponse });
