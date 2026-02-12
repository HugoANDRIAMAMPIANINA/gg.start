export default async function HelloWorld() {
  const response = await fetch("http://localhost:54321/hello-world");
  const data = await response.json();

  return <h1>{data.title}</h1>;
}
