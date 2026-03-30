const BASE_URL = 'http://localhost:3000';

export async function get<T>(url:string):Promise<T>{
    const response=await fetch(`${BASE_URL}${url}`);
    if(!response.ok){
        throw new Error(`请求失败:${response.status}`);
    }
    return response.json();
}

export async function post<T>(url:string, data:any): Promise<T> {
    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(`请求失败:${response.status}`);
    }
    return response.json();
}

export async function put<T>(url:string,data:any):Promise<T>{
    const response=await fetch(`${BASE_URL}${url}`,{
        method:'PUT',
        headers:{
            'Content-Type':'application/json',
        },
        body:JSON.stringify(data),
    });
    if(!response.ok){
        throw new Error(`请求失败:${response.status}`);
    }
    return response.json();
}

export async function del(url:string):Promise<void>{
    const response=await fetch(`${BASE_URL}${url}`,{
        method:'DELETE',
    });
    if(!response.ok){
        throw new Error(`请求失败:${response.status}`);
    }
}
    