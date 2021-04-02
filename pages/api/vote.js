// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL, {
  max: 5,
  ssl: { rejectUnauthorized: false },
  idle_timeout: 0,
  connect_timeout: 30,
});

await sql`
  CREATE TABLE IF NOT EXISTS Votes (
    answer smallint,
    company varchar(255)
  );
`;

export default async (req, res) => {
  if (req.method === "POST") {
    await sql`
      insert into Votes (
        answer, company
      ) values (
        ${req.body.vote ? 1 : 0}, ${req.body.company}
      )
    
      returning *
    `;
  }

  const votes = await sql`
    select answer, company from Votes
  `;

  return res.status(200).json(votes);
};
