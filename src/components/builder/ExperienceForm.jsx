import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { experienceSchema } from '../../lib/schemas';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useEffect, useRef } from 'react';
import { Trash2, Plus, ChevronUp, ChevronDown, Briefcase, Building2, Calendar, MapPin } from 'lucide-react';

const formSchema = z.object({
  experience: z.array(
    experienceSchema.omit({ bullets: true }).extend({
      bulletsText: z.string()
    })
  )
});

export function ExperienceForm() {
  const { experience, updateExperience, addExperience, removeExperience, setExperience } = useCVStore();

  // Map store experience to form format (join bullets)
  const defaultExperience = experience.map(exp => ({
    ...exp,
    bulletsText: exp.bullets ? exp.bullets.join('\n') : ''
  }));

  const { register, control, watch, reset, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { experience: defaultExperience },
    mode: 'onChange'
  });

  const { fields, append, remove, move } = useFieldArray({ control, name: 'experience' });

  // Re-sync form when store changes externally (e.g. reset or reorder)
  const prevExpRef = useRef(experience);
  useEffect(() => {
    const prev = prevExpRef.current;
    if (prev.length !== experience.length || prev.map(e => e.id).join() !== experience.map(e => e.id).join()) {
      reset({
        experience: experience.map(exp => ({
          ...exp,
          bulletsText: exp.bullets ? exp.bullets.join('\n') : ''
        }))
      });
      prevExpRef.current = experience;
    }
  }, [experience, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      const currentValues = value.experience;
      if (currentValues && currentValues.length > 0) {
        currentValues.forEach((exp, index) => {
          const storeId = useCVStore.getState().experience[index]?.id;
          if (storeId && exp) {
            const bullets = exp.bulletsText
              ? exp.bulletsText.split('\n').map(b => b.trim()).filter(b => b.length > 0)
              : [];
            const { bulletsText, id, ...rest } = exp;
            updateExperience(storeId, { ...rest, bullets });
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateExperience]);

  const handleAdd = () => {
    const newExp = {
      id: crypto.randomUUID(),
      title: '', company: '', location: '',
      startDate: '', endDate: '', current: false,
      bulletsText: ''
    };
    const { bulletsText, ...rest } = newExp;
    addExperience({ ...rest, bullets: [] });
    append(newExp);
  };

  const handleRemove = (index) => {
    const storeId = useCVStore.getState().experience[index]?.id;
    if (storeId) removeExperience(storeId);
    remove(index);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    move(index, index - 1);
    // also reorder in store
    const state = useCVStore.getState();
    const reordered = [...state.experience];
    [reordered[index], reordered[index - 1]] = [reordered[index - 1], reordered[index]];
    useCVStore.setState({ experience: reordered });
  };

  const handleMoveDown = (index) => {
    if (index >= fields.length - 1) return;
    move(index, index + 1);
    const state = useCVStore.getState();
    const reordered = [...state.experience];
    [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
    useCVStore.setState({ experience: reordered });
  };

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-xl overflow-hidden"
          style={{
            border: '1px solid var(--color-border)',
            background: 'var(--color-bg-surface-2)',
          }}
        >
          {/* Entry header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '1px solid var(--color-border)' }}
          >
            <h4
              className="text-sm font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {watch(`experience.${index}.title`) || `Experience ${index + 1}`}
            </h4>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-20 cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => { if (index > 0) e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleMoveDown(index)}
                disabled={index >= fields.length - 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors disabled:opacity-20 cursor-pointer"
                style={{ color: 'var(--color-text-muted)' }}
                onMouseEnter={e => { if (index < fields.length - 1) e.currentTarget.style.color = 'var(--color-text-primary)'; e.currentTarget.style.background = 'var(--color-bg-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.background = 'transparent'; }}
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors cursor-pointer"
                style={{ color: 'var(--color-danger)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Job Title</label>
                <Input {...register(`experience.${index}.title`)} placeholder="Software Engineer" icon={<Briefcase size={15} />} error={errors?.experience?.[index]?.title?.message} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Company</label>
                <Input {...register(`experience.${index}.company`)} placeholder="Acme Corp" icon={<Building2 size={15} />} error={errors?.experience?.[index]?.company?.message} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Start Date</label>
                <Input {...register(`experience.${index}.startDate`)} placeholder="Jan 2020" icon={<Calendar size={15} />} error={errors?.experience?.[index]?.startDate?.message} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>End Date</label>
                  <Input
                    {...register(`experience.${index}.endDate`)}
                    placeholder="Present"
                    disabled={watch(`experience.${index}.current`)}
                    icon={<Calendar size={15} />}
                    error={errors?.experience?.[index]?.endDate?.message}
                  />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>Location</label>
                <Input {...register(`experience.${index}.location`)} placeholder="San Francisco, CA" icon={<MapPin size={15} />} error={errors?.experience?.[index]?.location?.message} />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id={`current-${field.id}`}
                    {...register(`experience.${index}.current`)}
                    className="sr-only"
                  />
                  <label
                    htmlFor={`current-${field.id}`}
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <span
                      className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all duration-150"
                      style={{
                        background: watch(`experience.${index}.current`) ? 'var(--color-accent)' : 'transparent',
                        border: `1.5px solid ${watch(`experience.${index}.current`) ? 'var(--color-accent)' : 'var(--color-border-focus)'}`,
                      }}
                    >
                      {watch(`experience.${index}.current`) && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>Currently working here</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
                Responsibilities & Achievements
                <span className="ml-2 font-normal" style={{ color: 'var(--color-text-muted)' }}>— one per line, start with an action verb</span>
              </label>
              <Textarea
                {...register(`experience.${index}.bulletsText`)}
                placeholder={"Developed and maintained web applications using React...\nImproved page load speed by 40% through code splitting..."}
                className="min-h-[110px]"
                error={errors?.experience?.[index]?.bulletsText?.message}
              />
            </div>
          </div>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={handleAdd} className="w-full gap-2">
        <Plus size={15} /> Add Experience
      </Button>
    </div>
  );
}
