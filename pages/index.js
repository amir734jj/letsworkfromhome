import Head from "next/head";
import { Container } from "react-bootstrap";
import Vote from "../components/vote";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Container>
          <Vote />
        </Container>
      </main>

      <footer></footer>
    </div>
  );
}
