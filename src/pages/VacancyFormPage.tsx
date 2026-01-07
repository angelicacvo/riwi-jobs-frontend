import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Swal from 'sweetalert2';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vacancyService } from '@/services/vacancyService';
import { ModalityEnum, CreateVacancyDto } from '@/types';

const vacancySchema = z.object({
  title: z.string().min(5, 'El titulo debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripcion debe tener al menos 20 caracteres'),
  technologies: z.string().min(1, 'Las tecnologias son requeridas'),
  seniority: z.string().min(1, 'El nivel de experiencia es requerido'),
  softSkills: z.string().optional(),
  location: z.string().min(1, 'La ubicacion es requerida'),
  modality: z.enum(['remote', 'hybrid', 'onsite']),
  salaryRange: z.string().min(1, 'El rango salarial es requerido'),
  company: z.string().min(1, 'La empresa es requerida'),
  maxApplicants: z.coerce.number().min(1, 'Debe haber al menos 1 cupo'),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

const VacancyFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!id;

  const form = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: { title: '', description: '', technologies: '', seniority: '', softSkills: '', location: '', modality: 'remote', salaryRange: '', company: '', maxApplicants: 5 },
  });

  useEffect(() => {
    if (id) {
      vacancyService.getById(id).then(data => {
        form.reset({ ...data, softSkills: data.softSkills || '' });
      }).catch(() => navigate('/vacancies'));
    }
  }, [id, form, navigate]);

  const onSubmit = async (data: VacancyFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && id) {
        await vacancyService.update(id, data);
        Swal.fire({ icon: 'success', title: 'Vacante actualizada', timer: 1500, showConfirmButton: false });
      } else {
        await vacancyService.create(data as CreateVacancyDto);
        Swal.fire({ icon: 'success', title: 'Vacante creada', timer: 1500, showConfirmButton: false });
      }
      navigate('/vacancies');
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'No se pudo guardar' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
        <Card>
          <CardHeader><CardTitle>{isEditing ? 'Editar Vacante' : 'Nueva Vacante'}</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Titulo</Label><Input {...form.register('title')} />{form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}</div>
                <div className="space-y-2"><Label>Empresa</Label><Input {...form.register('company')} />{form.formState.errors.company && <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>}</div>
                <div className="space-y-2"><Label>Ubicacion</Label><Input {...form.register('location')} /></div>
                <div className="space-y-2"><Label>Modalidad</Label><Select value={form.watch('modality')} onValueChange={(v) => form.setValue('modality', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="remote">Remoto</SelectItem><SelectItem value="onsite">Presencial</SelectItem><SelectItem value="hybrid">Hibrido</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Seniority</Label><Input {...form.register('seniority')} placeholder="Junior, Mid, Senior" /></div>
                <div className="space-y-2"><Label>Rango Salarial</Label><Input {...form.register('salaryRange')} placeholder="$2000 - $3000 USD" /></div>
                <div className="space-y-2"><Label>Cupos</Label><Input {...form.register('maxApplicants')} type="number" min={1} /></div>
              </div>
              <div className="space-y-2"><Label>Tecnologias</Label><Input {...form.register('technologies')} placeholder="React, Node.js, TypeScript" /></div>
              <div className="space-y-2"><Label>Descripcion</Label><Textarea {...form.register('description')} rows={4} /></div>
              <div className="space-y-2"><Label>Habilidades Blandas (opcional)</Label><Input {...form.register('softSkills')} /></div>
              <div className="flex gap-3"><Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancelar</Button><Button type="submit" disabled={isLoading} className="gradient-accent">{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Guardando...</> : (isEditing ? 'Guardar' : 'Crear')}</Button></div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VacancyFormPage;
