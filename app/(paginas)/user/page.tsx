'use client'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { useEffect, useState } from "react";
import * as UserService from "./UserService";
import { user } from '../../lib/prisma/generated/client';

export default function UserPage(){
    
    const [usuarios, setUsers] = useState<user[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(()=>{
        UserService.find_many().then((values)=>{
            setUsers(values);
            setIsLoading(false)
        })
    }, [])
    return (
        <div className="bg-black">
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

function table(values:user[]){
    return (
        <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Nome</TableHead>
                    <TableHead>Email</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>

                {values.map((td)=> 
                    <TableRow>
                        <TableCell>{td.nome}</TableCell>
                        <TableCell>{td.email}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )
}