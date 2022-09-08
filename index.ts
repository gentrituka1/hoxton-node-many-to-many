import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('./db/setup.db', { verbose: console.log });

app.use(cors());
app.use(express.json());

const port = 4000;

const getSelectedApplicant = db.prepare(`
    SELECT * FROM applicants WHERE id = @id;
`)

const getSelectedInterviewer = db.prepare(`
    SELECT * FROM interviewers WHERE id = @id;
`)


const getInterviewersForApplicant = db.prepare(`
    SELECT interviewers.* FROM interviewers
    JOIN interviews ON interviewers.id = interviews.applicantId
    WHERE interviews.applicantId = @applicantId;
`)

const getApplicantsForInterviewer = db.prepare(`
    SELECT applicants.* FROM applicants
    JOIN interviews ON applicants.id = interviews.applicantId
    WHERE interviews.interviewerId = @interviewerId;
`)

const getInterviewsForApplicant = db.prepare(`
    SELECT * FROM interviews WHERE applicantId = @applicantId;
`)

const getInterviewsForInterviewer = db.prepare(`
    SELECT * FROM interviews WHERE interviewerId = @interviewerId;
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

app.get('/interviewers/:id', (req, res) => {
    //  - Get details of an interviewer, including a list of every interview they've conducted and who the applicant was

    const interviewer = getSelectedInterviewer.get(req.params);

    if(interviewer){
        interviewer.interviews = getInterviewsForInterviewer.all({interviewerId: interviewer.id});
        interviewer.applicants = getApplicantsForInterviewer.all({interviewerId: interviewer.id});
        res.send(interviewer);
    } else{
        res.status(404).send("Interviewer not found");
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})