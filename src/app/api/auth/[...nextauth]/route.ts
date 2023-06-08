import NextAuth from "next-auth";
import { authOptions } from "~/server/auth";

const handler = NextAuth(authOptions);
/**
 * In new app router, nextauth requires you to export the handler as get and post
 * functions in order for its functionality to work.
*/
export { handler as GET, handler as POST };