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
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  description: z.string().min(20, 'La descripción debe tener al menos 20 caracteres'),
  technologies: z.string().min(1, 'Las tecnologías son requeridas'),
  seniority: z.string().min(1, 'El nivel de experiencia es requerido'),
  softSkills: z.string().optional(),
  location: z.string().min(1, 'La ubicación es requerida'),
  modality: z.nativeEnum(ModalityEnum),
  salaryRange: z.string().min(1, 'El rango salarial es requerido'),
  company: z.string().min(1, 'La empresa es requerida'),
  maxApplicants: z.coerce.number().min(1, 'Debe haber al menos 1 cupo'),
});

type VacancyFormData = z.infer<typeof vacancySchema>;

const VacancyFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!id);
  const isEditing = !!id;

  const form = useForm<VacancyFormData>({
    resolver: zodResolver(vacancySchema),
    defaultValues: {
      title: '',
      description: '',
      technologies: '',
      seniority: '',
      softSkills: '',
      location: '',
      modality: ModalityEnum.REMOTE,
      salaryRange: '',
      company: '',
      maxApplicants: 5,
    },
  });

  useEffect(() => {
    if (id) {
      const fetchVacancy = async () => {
        try {
          const vacancy = await vacancyService.getById(id);
          form.reset({
            title: vacancy.title,
            description: vacancy.description,
            technologies: vacancy.technologies,
            seniority: vacancy.seniority,
            softSkills: vacancy.softSkills || '',
            location: vacancy.location,
            modality: vacancy.modality,
            salaryRange: vacancy.salaryRange,
            company: vacancy.company,
            maxApplicants: vacancy.maxApplicants,
          });
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo cargar la vacante' });
          navigate('/vacancies');
        } finally {
          setIsFetching(false);
        }
      };
      fetchVacancy();
    }
  }, [id, form, navigate]);

  const handleSubmit = async (data: VacancyFormData) => {
    setIsLoading(true);
    try {
      if (isEditing && id) {
        await vacancyService.update(id, { ...data, softSkills: data.softSkills || undefined });
        Swal.fire({ 
          icon: 'success', 
          title: '¡Actualizada!', 
          text: 'Vacante actualizada correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await vacancyService.create({ ...data, softSkills: data.softSkills || undefined });
        Swal.fire({ 
          icon: 'success', 
          title: '¡Creada!', 
          text: 'Vacante creada correctamente',
          timer: 2000,
          showConfirmButton: false,
        });
      }
      navigate('/vacancies');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al guardar la vacante';
      Swal.fire({ icon: 'error', title: 'Error', text: Array.isArray(message) ? message[0] : message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in max-w-3xl mx-auto">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {isEditing ? 'Editar Vacante' : 'Crear Nueva Vacante'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del puesto *</Label>
                  <Input id="title" placeholder="Ej: Desarrollador Full Stack" {...form.register('title')} />
                  {form.formState.errors.title && (
                    <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Empresa *</Label>
                  <Input id="company" placeholder="Nombre de la empresa" {...form.register('company')} />
                  {form.formState.errors.company && (
                    <p className="text-sm text-destructive">{form.formState.errors.company.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe las responsabilidades y requisitos del puesto..."
                  rows={5}
                  {...form.register('description')} 
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="technologies">Tecnologías * (separadas por coma)</Label>
                  <Input id="technologies" placeholder="React, Node.js, TypeScript" {...form.register('technologies')} />
                  {form.formState.errors.technologies && (
                    <p className="text-sm text-destructive">{form.formState.errors.technologies.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seniority">Nivel de Experiencia *</Label>
                  <Input id="seniority" placeholder="Ej: Junior, Mid, Senior" {...form.register('seniority')} />
                  {form.formState.errors.seniority && (
                    <p className="text-sm text-destructive">{form.formState.errors.seniority.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input id="location" placeholder="Ej: Bogotá, Colombia" {...form.register('location')} />
                  {form.formState.errors.location && (
                    <p className="text-sm text-destructive">{form.formState.errors.location.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidad *</Label>
                  <Select
                    value={form.watch('modality')}
                    onValueChange={(value) => form.setValue('modality', value as ModalityEnum)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ModalityEnum.REMOTE}>Remoto</SelectItem>
                      <SelectItem value={ModalityEnum.ONSITE}>Presencial</SelectItem>
                      <SelectItem value={ModalityEnum.HYBRID}>Híbrido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryRange">Rango Salarial *</Label>
                  <Input id="salaryRange" placeholder="Ej: $3,000 - $5,000 USD" {...form.register('salaryRange')} />
                  {form.formState.errors.salaryRange && (
                    <p className="text-sm text-destructive">{form.formState.errors.salaryRange.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxApplicants">Cupos Máximos *</Label>
                  <Input 
                    id="maxApplicants" 
                    type="number" 
                    min={1}
                    {...form.register('maxApplicants')} 
                  />
                  {form.formState.errors.maxApplicants && (
                    <p className="text-sm text-destructive">{form.formState.errors.maxApplicants.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="softSkills">Habilidades Blandas (opcional)</Label>
                <Input id="softSkills" placeholder="Ej: Trabajo en equipo, Comunicación" {...form.register('softSkills')} />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 gradient-accent hover:opacity-90" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isEditing ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    isEditing ? 'Actualizar Vacante' : 'Crear Vacante'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default VacancyFormPage;
