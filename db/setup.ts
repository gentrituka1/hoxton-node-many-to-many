import Database from "better-sqlite3";

const db = new Database('./db/setup.db', { verbose: console.log });

function everythingApplicants(){

    const applicants = [
        {
            name: "Gentrit Uka",
            email: "gentrit@gmail.com",
        },
        {
            name: "Reymond Reddington",
            email: "reddington@gmail.com"
        },
        {
            name: "Elisabeth Keen",
            email: "elisabeth@gmail.com"
        }
    ]

const dropApplicantsTable = db.prepare(`
    DROP TABLE IF EXISTS applicants;
`)
dropApplicantsTable.run();

const createApplicantsTable = db.prepare(`
    CREATE TABLE IF NOT EXISTS applicants (
        id INTEGER NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        PRIMARY KEY (id)
    );
`)
createApplicantsTable.run();



const createNewApplicant = db.prepare(`
    INSERT INTO applicants (name, email) VALUES (@name, @email);
`)

for(let applicant of applicants){
    createNewApplicant.run(applicant);
}
}

everythingApplicants();

function everythingInterviewers(){
    
        const interviewers = [
            {
                name: "Donald Resler",
                email: "donald@gmail.com"
            },
            {
                name: "Tom Keen",
                email: "tom@gmail.com"
            },
            {
                name: "Katarina Rostova",
                email: "katarina@gmail.com"
            }
        ]

    const dropInterviewersTable = db.prepare(`
        DROP TABLE IF EXISTS interviewers;
    `)
    dropInterviewersTable.run();

    const createInterviewersTable = db.prepare(`
        CREATE TABLE IF NOT EXISTS interviewers (
            id INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            PRIMARY KEY (id)
        );
    `)
    createInterviewersTable.run();

    const createNewInterviewer = db.prepare(`
        INSERT INTO interviewers (name, email) VALUES (@name, @email);
    `)

    for(let interviewer of interviewers){
        createNewInterviewer.run(interviewer);
    }
}

everythingInterviewers();

function everythingInterviews(){
        
            const interviews = [
                {
                    applicantId: 1,
                    interviewerId: 1,
                    date: "2021-01-01",
                    score: 5
                },
                {
                    applicantId: 1,
                    interviewerId: 2,
                    date: "2021-01-01",
                    score: 4
                },
                {
                    applicantId: 1,
                    interviewerId: 3,
                    date: "2021-01-01",
                    score: 3
                },
                {
                    applicantId: 2,
                    interviewerId: 1,
                    date: "2021-01-04",
                    score: 3,
                },
                {
                    applicantId: 2,
                    interviewerId: 2,
                    date: "2021-01-04",
                    score: 4,
                },
                {
                    applicantId: 2,
                    interviewerId: 3,
                    date: "2021-01-04",
                    score: 2,
                },
                {
                    applicantId: 3,
                    interviewerId: 1,
                    date: "2021-01-07",
                    score: 5,
                },
                {
                    applicantId: 3,
                    interviewerId: 2,
                    date: "2021-01-07",
                    score: 5,
                },
                {
                    applicantId: 3,
                    interviewerId: 3,
                    date: "2021-01-07",
                    score: 5,
                }
            ]
    
        const dropInterviewsTable = db.prepare(`
            DROP TABLE IF EXISTS interviews;
        `)
        dropInterviewsTable.run();

        const createInterviewsTable = db.prepare(`
            CREATE TABLE IF NOT EXISTS interviews (
                id INTEGER NOT NULL,
                applicantId INTEGER NOT NULL,
                interviewerId INTEGER  NOT NULL,
                date TEXT,
                score INTEGER,
                PRIMARY KEY (id),
                FOREIGN KEY (applicantId) REFERENCES applicants(id) ON DELETE CASCADE,
                FOREIGN KEY (interviewerId) REFERENCES interviewers(id) ON DELETE CASCADE
            );
        `)
        createInterviewsTable.run();

    
        const createNewInterview = db.prepare(`
            INSERT INTO interviews (applicantId, interviewerId, date, score) VALUES (@applicantId, @interviewerId, @date, @score);
        `)
    
        for(let interview of interviews){
            createNewInterview.run(interview);
        }
}

everythingInterviews();