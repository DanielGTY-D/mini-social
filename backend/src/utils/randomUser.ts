export const randomUser = (): string => {
	const base = "user";
	const random =
		(Math.random() * Date.now()).toString(32).toLowerCase().split(".")[1] +
		(Math.random() * (9 * 9)).toString(32).toLowerCase().split(".")[1];
	return `${base} - ${random}`;
};
