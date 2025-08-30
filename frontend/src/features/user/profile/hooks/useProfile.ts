import { isAxiosError } from "axios";
import { API } from "../../../../config/axios";
import { UserSchema } from "../schemas/user";
import type { updatedUserInfo } from "../models/user";

const useProfile = () => {

	const getUser = async () => {
		try {
            const {data} = await API.get("/user/get");
            const results = UserSchema.safeParse(data);

			if(results.success) {
				return results.data;
			}
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	const updateProfile = async (updateUser: updatedUserInfo) => {
		try {
			const {data} = await API.patch("/user/update", updateUser)
			return data
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	}

	return {
        getUser,
		updateProfile
    };
};

export default useProfile;
