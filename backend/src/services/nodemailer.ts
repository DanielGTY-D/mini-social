import nodemailer from "nodemailer";
import dotenv from 'dotenv'

dotenv.config()

const transport = nodemailer.createTransport({
	host: process.env.NM_HOST,
	port: +process.env.NM_PORT,
	auth: {
		user: process.env.NM_USER,
		pass: process.env.NM_PASS,
	},
});

export const sendVerificationEmail = async (email: string, token: string) => {
	await transport.sendMail({
		from: `Quickli ${email}`,
		to: email,
		subject: "Verifica tu email",
		html: `<p>Ingrea el token para confirmar tu cuenta ${token}</p>`,
	});
};
