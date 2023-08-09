import type { VercelRequest, VercelResponse } from "@vercel/node";
import { calendar } from "../../lib/calendar";

const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (calendar.client === null) {
    calendar.init();
  }
  return response.status(200).json({ status: calendar.status });
};

export default handler;
