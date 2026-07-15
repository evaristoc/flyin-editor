import { apiFetch } from "./client";

export async function getSolutions(){
	return apiFetch("/api/solutions");
}

export async function getSolution(name: string){
	return apiFetch(`/solution/${name}`);
}
