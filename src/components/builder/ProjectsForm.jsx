import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { projectSchema } from '../../lib/schemas';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useEffect } from 'react';
import { Trash2, Plus, Globe, Box, Wrench } from 'lucide-react';

const formSchema = z.object({
  projects: z.array(projectSchema)
});

export function ProjectsForm() {
  const { projects, updateProject, addProject, removeProject } = useCVStore();
  
  const { register, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { projects },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects'
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const currentValues = value.projects;
      if (currentValues && currentValues.length > 0) {
        currentValues.forEach((proj, index) => {
          const storeId = useCVStore.getState().projects[index]?.id;
          if (storeId) {
            const { id, ...rest } = proj;
            updateProject(storeId, rest);
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateProject]);

  const handleAdd = () => {
    const newProj = {
      id: crypto.randomUUID(),
      name: '',
      description: '',
      techStack: '',
      link: ''
    };
    addProject(newProj);
    append(newProj);
  };

  const handleRemove = (index) => {
    const storeId = useCVStore.getState().projects[index]?.id;
    if (storeId) removeProject(storeId);
    remove(index);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-hover)] space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-[var(--color-text-primary)]">Project {index + 1}</h4>
            <Button variant="ghost" size="icon" onClick={() => handleRemove(index)} className="text-[var(--color-danger)] hover:text-red-400 hover:bg-red-400/10">
              <Trash2 size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Project Name</label>
              <Input {...register(`projects.${index}.name`)} placeholder="E-commerce Platform" icon={<Box size={15} />} error={errors?.projects?.[index]?.name?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Link (optional)</label>
              <Input {...register(`projects.${index}.link`)} placeholder="https://github.com/..." icon={<Globe size={15} />} error={errors?.projects?.[index]?.link?.message} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Tech Stack</label>
              <Input {...register(`projects.${index}.techStack`)} placeholder="React, Node.js, MongoDB" icon={<Wrench size={15} />} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Description</label>
              <Textarea 
                {...register(`projects.${index}.description`)} 
                placeholder="Built a full-stack e-commerce platform that increased sales by 20%..."
                className="min-h-[80px]"
                error={errors?.projects?.[index]?.description?.message}
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={handleAdd} className="w-full gap-2">
        <Plus size={16} /> Add Project
      </Button>
    </div>
  );
}
