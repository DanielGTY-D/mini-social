import { API } from "../../../../config/axios";
import type { auth } from "../../../../types/auth";
import { isAxiosError } from "axios";

const useLogin = () => {
	const loginUser = async (user: auth) => {
		try {
			const { data } = await API.post("/auth/login", user);
			return data;
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				throw new Error(error.response.data.error);
			}
		}
	};

	return {
		loginUser,
	};
};

export default useLogin;
