
export async function createUser(nome: string, email: string, senha: string) {

  const response = await fetch("../api/usuario/create/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nome,
      email,
      senha,
    }),
  });

  return response.json();
}



export async function findUser(email: string, senha: string) {

  console.log("opa\n\n\n\n");

  const response = await fetch("../api/usuario/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      senha,
    }),
  });

  return response.json();
}