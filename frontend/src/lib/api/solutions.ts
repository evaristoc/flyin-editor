import { apiFetch } from "./client";

export async function getSolutions(){
	return apiFetch("/api/solutions");
}

export async function getSolution(name: string){
	const res = await apiFetch(`/api/solution/${name}`);
	if (res.status != 'ok'){
		throw new Error(`HTTP error connecting to solution/{name} endpoint: ${res.status}`);
	}
	console.log(res);
	return res;
}
