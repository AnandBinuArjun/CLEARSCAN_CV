import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { educationSchema } from '../../lib/schemas';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useEffect, useRef } from 'react';
import { Trash2, Plus, ChevronUp, ChevronDown, GraduationCap, Building, Calendar, MapPin, Hash } from 'lucide-react';

const formSchema = z.object({ education: z.array(educationSchema) });

export function EducationForm() {
  const { education, updateEducation, addEducation, removeEducation } = useCVStore();

  const { register, control, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { education },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'education' });

  // Re-sync on external store changes
  const prevEduRef = useRef(education);
  useEffect(() => {
    const prev = prevEduRef.current;
    if (prev.length !== education.length || prev.map(e => e.id).join() !== education.map(e => e.id).join()) {
      reset({ education });
      prevEduRef.current = education;
    }
  }, [education, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      const currentValues = value.education;
      if (currentValues && currentValues.length > 0) {
        currentValues.forEach((edu, index) => {
          const storeId = useCVStore.getState().education[index]?.id;
          if (storeId && edu) {
            const { id, ...rest } = edu;
            updateEducation(storeId, rest);
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateEducation]);

  const handleAdd = () => {
    const newEdu = { id: crypto.randomUUID(), degree: '', institution: '', location: '', startDate: '', endDate: '', current: false, gpa: '' };
    addEducation(newEdu);
    append(newEdu);
  };

  const handleRemove = (index) => {
    const storeId = useCVStore.getState().education[index]?.id;
    if (storeId) removeEducation(storeId);
    remove(index);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    move(index, index - 1);
    const state = useCVStore.getState();
    const reordered = [...state.education];
    [reordered[index], reordered[index - 1]] = [reordered[index - 1], reordered[index]];
    useCVStore.setState({ education: reordered });
  };

  const handleMoveDown = (index) => {
    if (index >= fields.length - 1) return;
    move(index, index + 1);
    const state = useCVStore.getState();
    const reordered = [...state.education];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    useCVStore.setState({ education: reordered });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const isCurrent = watch(`education.${index}.current`);
        return (
          <div
            key={field.id}
            className="rounded-xl overflow-hidden"
            style={{ border: '1px solid var(--color-border)', background: 'var(--color-bg-surface-2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {watch(`education.${index}.degree`) || `Education ${index + 1}`}
              </h4>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => handleMoveUp(index)} disabled={index === 0}
                  className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-20 cursor-pointer transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  title="Move up"><ChevronUp size={14} /></button>
                <button type="button" onClick={() => handleMoveDown(index)} disabled={index >= fields.length - 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg disabled:opacity-20 cursor-pointer transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-bg-hover)'; e.currentTarget.style.color = 'var(--color-text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; }}
                  title="Move down"><ChevronDown size={14} /></button>
                <button type="button" onClick={() => handleRemove(index)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer transition-colors"
                  style={{ color: 'var(--color-danger)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  title="Remove"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Degree / Program</label>
                  <Input {...register(`education.${index}.degree`)} placeholder="B.S. Computer Science" icon={<GraduationCap size={15} />} error={errors?.education?.[index]?.degree?.message} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Institution</label>
                  <Input {...register(`education.${index}.institution`)} placeholder="University of Technology" icon={<Building size={15} />} error={errors?.education?.[index]?.institution?.message} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Start Date</label>
                  <Input {...register(`education.${index}.startDate`)} placeholder="Sep 2018" icon={<Calendar size={15} />} error={errors?.education?.[index]?.startDate?.message} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                    {isCurrent ? 'Expected Graduation' : 'End Date'}
                  </label>
                  <Input
                    {...register(`education.${index}.endDate`)}
                    placeholder={isCurrent ? 'May 2026' : 'May 2022'}
                    icon={<Calendar size={15} />}
                    error={errors?.education?.[index]?.endDate?.message}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Location</label>
                  <Input {...register(`education.${index}.location`)} placeholder="Boston, MA" icon={<MapPin size={15} />} error={errors?.education?.[index]?.location?.message} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>GPA (Optional)</label>
                  <Input {...register(`education.${index}.gpa`)} placeholder="3.8 / 4.0" icon={<Hash size={15} />} error={errors?.education?.[index]?.gpa?.message} />
                </div>
              </div>

              {/* Currently studying toggle */}
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id={`edu-current-${field.id}`}
                  {...register(`education.${index}.current`)}
                  className="sr-only"
                />
                <label
                  htmlFor={`edu-current-${field.id}`}
                  className="flex items-center gap-2.5 cursor-pointer select-none"
                >
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-150"
                    style={{
                      background: isCurrent ? 'var(--color-accent)' : 'transparent',
                      border: `1.5px solid ${isCurrent ? 'var(--color-accent)' : 'var(--color-border-focus)'}`,
                    }}
                  >
                    {isCurrent && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Currently studying here</span>
                </label>
              </div>
            </div>
          </div>
        );
      })}

      <Button type="button" variant="secondary" onClick={handleAdd} className="w-full gap-2">
        <Plus size={15} /> Add Education
      </Button>
    </div>
  );
}
