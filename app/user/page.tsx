'use client'

import { useEffect, useState } from "react";
import * as UserService from "./UserService";
import { User } from '../lib/prisma/generated/client';

export default function UserPage(){
    
    const [usuarios, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        UserService.find_many().then((values)=>{
            setUsers(values);
            setIsLoading(false)
        })
    })
    return (
        <div>
            <div>Pagina do usuario</div>
            {isLoading? loading(): table(usuarios)}
            
        </div>
    )
}
function loading(){
    return (
        <div>Carregando página...</div>
    )
}

function table(values:User[]){
    return (
        <table>
            <tr>
                <th>Nome</th>   
                <th>Email</th>   
            </tr>
            {values.map((td)=> 
                <tr>
                    <td>{td.nome}</td>
                    <td>{td.email}</td>
                </tr>
            )}
        </table>
    )
}