import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('./db/setup.db', { verbose: console.log });

app.use(cors());
app.use(express.json());

const port = 4000;

const getApplicantById = db.prepare(`
    SELECT * FROM applicants WHERE id = @id;
`)

const getInterviewerById = db.prepare(`
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

const createNewApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (@name, @email);
`)

const createNewInterviewer = db.prepare(`
    INSERT INTO interviewers (name, email) VALUES (@name, @email);
`)

const createNewInterview = db.prepare(`

`)


app.get('/applicants/:id', (req, res) => {
    // Get details of an applicant, including a list of every interview they've had and who the interviewer was

    const id = req.params.id;
    const applicant = getApplicantById.get(id);

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

    const interviewer = getInterviewerById.get(req.params);

    if(interviewer){
        interviewer.interviews = getInterviewsForInterviewer.all({interviewerId: interviewer.id});
        interviewer.applicants = getApplicantsForInterviewer.all({interviewerId: interviewer.id});
        res.send(interviewer);
    } else{
        res.status(404).send("Interviewer not found");
    }
})

app.post('/applicant', (req, res) => {
    // Create a new applicant
    const name = req.body.name
    const email = req.body.email

    const errors: string[] = []

    if(typeof name !== 'string'){
        errors.push("The name is not provided or is not a string");
    }
    if(typeof email !== 'string'){
        errors.push("The email is not provided or is not a string");
    }

    if(errors.length === 0){
        const info = createNewApplicant.run(name, email);
        const applicant = getApplicantById.get(info.lastInsertRowid);
        applicant.interviews = getInterviewsForApplicant.all(applicant.id);
        applicant.interviewers = getInterviewersForApplicant.all(applicant.id);
        res.send(applicant);
    } else{
        res.status(400).send({  error: errors   });
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})