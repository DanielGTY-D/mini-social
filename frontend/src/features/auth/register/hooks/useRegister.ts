import { API } from "../../../../config/axios";
import type { auth } from "../../../../types/auth";
import { isAxiosError } from "axios";

const useRegister = () => {
	const createNewUser = async (user: auth) => {
		try {
			const { data } = await API.post(
				"/auth/register",
				user
			);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};


	return {
        createNewUser
    };
};

export default useRegister;