import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { certificationSchema } from '../../lib/schemas';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useEffect } from 'react';
import { Trash2, Plus, Award, Building, Calendar } from 'lucide-react';

const formSchema = z.object({
  certifications: z.array(certificationSchema)
});

export function CertificationsForm() {
  const { certifications, updateCertification, addCertification, removeCertification } = useCVStore();
  
  const { register, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { certifications },
    mode: 'onChange'
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications'
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const currentValues = value.certifications;
      if (currentValues && currentValues.length > 0) {
        currentValues.forEach((cert, index) => {
          const storeId = useCVStore.getState().certifications[index]?.id;
          if (storeId) {
            const { id, ...rest } = cert;
            updateCertification(storeId, rest);
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateCertification]);

  const handleAdd = () => {
    const newCert = {
      id: crypto.randomUUID(),
      name: '',
      issuer: '',
      date: ''
    };
    addCertification(newCert);
    append(newCert);
  };

  const handleRemove = (index) => {
    const storeId = useCVStore.getState().certifications[index]?.id;
    if (storeId) removeCertification(storeId);
    remove(index);
  };

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-surface-hover)] space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-[var(--color-text-primary)]">Certification {index + 1}</h4>
            <Button variant="ghost" size="icon" onClick={() => handleRemove(index)} className="text-[var(--color-danger)] hover:text-red-400 hover:bg-red-400/10">
              <Trash2 size={16} />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Certification Name</label>
              <Input {...register(`certifications.${index}.name`)} placeholder="AWS Certified Solutions Architect" icon={<Award size={15} />} error={errors?.certifications?.[index]?.name?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Issuer</label>
              <Input {...register(`certifications.${index}.issuer`)} placeholder="Amazon Web Services" icon={<Building size={15} />} error={errors?.certifications?.[index]?.issuer?.message} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[var(--color-text-secondary)]">Date Obtained</label>
              <Input {...register(`certifications.${index}.date`)} placeholder="Oct 2023" icon={<Calendar size={15} />} error={errors?.certifications?.[index]?.date?.message} />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={handleAdd} className="w-full gap-2">
        <Plus size={16} /> Add Certification
      </Button>
    </div>
  );
}
