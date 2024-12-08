import { db } from "@/db/drizzle"
import { questionsTable } from "@/db/schema"
import { eq } from "drizzle-orm"
export const db_getQuestionById = async (id: number) => {
    try {

        const question = await db.query.questionsTable.findFirst({where: eq(questionsTable.id, id )})
        
    } catch (error) {
        console.log(error)
    }
}