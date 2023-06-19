import axios, { AxiosRequestConfig } from "axios";
import { toast } from "react-hot-toast";

export const useUserEdit = () => {
  const editUserName = async (newName: string) => {
    const requestConfig: AxiosRequestConfig = {
      method: "POST",
      url: "/api/user/edit",
      data: {
        name: newName,
      },
    };

    try {
      await axios(requestConfig);
      toast.success("Updated!");
    } catch (err) {
      toast.error("Error updating user");
    }
  };

  return {
    editUserName,
  };
};
