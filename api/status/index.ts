import type { VercelRequest, VercelResponse } from "@vercel/node";
import { calendar } from "../../src/calendar";

const handler = async (request: VercelRequest, response: VercelResponse) => {
  return response.status(200).json({ status: calendar.status });
};

export default handler;
