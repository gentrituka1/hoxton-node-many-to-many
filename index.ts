import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('./db/setup.db', { verbose: console.log });

app.use(cors());
app.use(express.json());

const port = 4000;


const getInterviewersForApplicant = db.prepare(`
    SELECT interviewers.* FROM interviewers
    JOIN interviews ON interviewers.id = interviews.applicantId
    WHERE interviews.applicantId = @applicantId;
`)

const getInterviewsForApplicant = db.prepare(`
    SELECT * FROM interviews WHERE applicant_id = @applicant_id;
`)

const getSelectedApplicant = db.prepare(`
    SELECT * FROM applicants WHERE id = @id;
`)




app.get('/applicants/:id', (req, res) => {
    // Get details of an applicant, including a list of every interview they've had and who the interviewer was

    const id = req.params.id;
    const applicant = getSelectedApplicant.get(id);

    if(applicant){
        applicant.interviews = getInterviewsForApplicant.all(id);
        applicant.interviewers = getInterviewersForApplicant.all(id);
        res.send(applicant);
    } else{
        res.status(404).send("Applicant not found");
    }


})

app.get('/applicants', (req, res) => {})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})