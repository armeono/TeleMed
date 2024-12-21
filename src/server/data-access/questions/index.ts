import { db } from "@/db/drizzle"
import { medicalInquiry } from "@/db/schema"
import { eq } from "drizzle-orm"
export const db_getQuestionById = async (id: number) => {
    try {

        const question = await db.query.medicalInquiry.findFirst({where: eq(medicalInquiry.id, id )})
        return question; 

    } catch (error) {
        console.log(error)
    }
}


// fetch questions by doctor and patient id 


