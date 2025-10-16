'use client';

import { useState, useMemo } from 'react';
import type { TimeRecord } from '@/lib/types';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, User, X } from 'lucide-react';
import { format } from 'date-fns';
import { type DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

export function AdminDashboard({ records, userNames }: { records: TimeRecord[], userNames:string[] }) {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [selectedUser, setSelectedUser] = useState<string>('all');

    const filteredRecords = useMemo(() => {
        return records
            .filter(record => {
                if (!dateRange?.from) return true;
                const recordDate = new Date(record.timestamp);
                
                const from = new Date(dateRange.from.setHours(0, 0, 0, 0));
                const to = dateRange.to ? new Date(dateRange.to.setHours(23, 59, 59, 999)) : new Date(from.setHours(23, 59, 59, 999));

                return recordDate >= from && recordDate <= to;
            })
            .filter(record => {
                if (selectedUser === 'all') return true;
                return record.userName === selectedUser;
            });
    }, [records, dateRange, selectedUser]);

    const handleExport = () => {
        const csvHeader = 'Usuario;Tipo;Marca de Tiempo;Dirección IP\n';
        const csvRows = filteredRecords.map(r => 
            `"${r.userName}";"${r.type === 'in' ? 'Entrada' : 'Salida'}";"${format(new Date(r.timestamp), 'yyyy-MM-dd HH:mm:ss')}";"${r.ipAddress}"`
        ).join('\n');

        const csvContent = csvHeader + csvRows;
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.download = `cpg_la_marina_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const clearFilters = () => {
      setDateRange(undefined);
      setSelectedUser('all');
    };

    const hasActiveFilters = dateRange !== undefined || selectedUser !== 'all';

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Registros de Tiempo</CardTitle>
                <CardDescription>Filtra, visualiza y exporta el historial de registros de entrada/salida.</CardDescription>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                    <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="Filtrar por usuario" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los Usuarios</SelectItem>
                        {userNames.map(name => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {hasActiveFilters && (
                      <Button variant="ghost" onClick={clearFilters}>
                        <X className="mr-2 h-4 w-4"/>
                        Limpiar
                      </Button>
                    )}
                    <div className="sm:ml-auto">
                      <Button onClick={handleExport} disabled={filteredRecords.length === 0}>
                          <Download className="mr-2 h-4 w-4" />
                          Exportar CSV
                      </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead className="text-center">Tipo</TableHead>
                                <TableHead>Marca de Tiempo</TableHead>
                                <TableHead>Dirección IP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.userName}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant={record.type === 'in' ? 'default' : 'secondary'} className={record.type === 'in' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                                              {record.type === 'in' ? 'Entrada' : 'Salida'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(record.timestamp), 'd MMM, yyyy, h:mm:ss a')}</TableCell>
                                        <TableCell className="font-code text-muted-foreground">{record.ipAddress}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No hay registros que coincidan con tus filtros.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
