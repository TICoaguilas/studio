'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, User } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { handleManualClockEvent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function ManualEntryForm({ userNames }: { userNames: string[] }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const [userName, setUserName] = useState<string | undefined>();
  const [type, setType] = useState<'in' | 'out'>('in');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>(format(new Date(), 'HH:mm'));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName || !date || !time) {
      toast({
        title: 'Error',
        description: 'Por favor, completa todos los campos.',
        variant: 'destructive',
      });
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(hours, minutes);

    startTransition(async () => {
      const result = await handleManualClockEvent(userName, type, combinedDateTime);
      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      } else if (result?.success) {
        toast({
          title: 'Éxito',
          description: result.message,
        });
        // Reset form
        setUserName(undefined);
        setType('in');
        setDate(new Date());
        setTime(format(new Date(), 'HH:mm'));
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="user-select">Empleado</Label>
                <Select onValueChange={setUserName} value={userName}>
                  <SelectTrigger id="user-select">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Selecciona un empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    {userNames.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Tipo de Registro</Label>
                <RadioGroup
                  defaultValue="in"
                  className="flex items-center space-x-4 pt-2"
                  value={type}
                  onValueChange={(value: 'in' | 'out') => setType(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="in" id="in" />
                    <Label htmlFor="in">Entrada</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="out" id="out" />
                    <Label htmlFor="out">Salida</Label>
                  </div>
                </RadioGroup>
            </div>
             <div className="space-y-2">
                <Label htmlFor="date-picker">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
            </div>
             <div className="space-y-2">
                <Label htmlFor="time-input">Hora</Label>
                <Input
                    id="time-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                />
            </div>
        </div>
      <Button type="submit" disabled={isPending} className="w-full md:w-auto">
        {isPending ? 'Guardando...' : 'Guardar Registro Manual'}
      </Button>
    </form>
  );
}
