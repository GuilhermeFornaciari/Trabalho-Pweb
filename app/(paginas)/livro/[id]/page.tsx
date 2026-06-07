import { use } from "react";

export default function DetalhesLivro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const {id} = use(params);
  return(
    <h1>Livro id: {id}</h1>
  );
}