import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCVStore } from '../../store/cvStore';
import { Input } from '../ui/Input';
import { useEffect } from 'react';
import { User, Mail, Phone, MapPin, Link as LinkIcon, Globe, Briefcase } from 'lucide-react';

// Normalize LinkedIn URL: strip prefix, keep only slug
function normalizeLinkedIn(val) {
  if (!val) return '';
  const stripped = val.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//i, '').replace(/\/$/, '');
  return stripped ? `https://linkedin.com/in/${stripped}` : '';
}

// Accept bare slugs or full URLs for portfolio
function normalizeUrl(val) {
  if (!val) return '';
  if (/^https?:\/\//i.test(val)) return val;
  return `https://${val}`;
}

const personalInfoSchema = z.object({
  fullName:  z.string().min(1, 'Full name is required'),
  email:     z.string().email('Invalid email address'),
  phone:     z.string().optional().or(z.literal('')),
  location:  z.string().optional().or(z.literal('')),
  linkedin:  z.string().optional().or(z.literal('')),
  portfolio: z.string().optional().or(z.literal('')),
});

export function PersonalInfoForm() {
  const { personalInfo, updatePersonalInfo } = useCVStore();

  const { register, watch, formState: { errors } } = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo,
    mode: 'onChange'
  });

  useEffect(() => {
    const subscription = watch((value) => {
      const result = personalInfoSchema.safeParse(value);
      updatePersonalInfo(result.success ? result.data : value);
    });
    return () => subscription.unsubscribe();
  }, [watch, updatePersonalInfo]);

  const fields = [
    { name: 'fullName',  label: 'Full Name',          placeholder: 'John Doe',             type: 'text',  required: true,  icon: <User size={15} /> },
    { name: 'jobTitle',  label: 'Job Title',          placeholder: 'Senior Product Manager',type: 'text',  required: false, icon: <Briefcase size={15} /> },
    { name: 'email',     label: 'Email Address',       placeholder: 'john@example.com',     type: 'email', required: true,  icon: <Mail size={15} /> },
    { name: 'phone',     label: 'Phone Number',        placeholder: '+1 (555) 123-4567',    type: 'tel',   required: false, icon: <Phone size={15} /> },
    { name: 'location',  label: 'Location',            placeholder: 'New York, NY',         type: 'text',  required: false, icon: <MapPin size={15} /> },
    { name: 'linkedin',  label: 'LinkedIn',            placeholder: 'linkedin.com/in/you',  type: 'text',  required: false, hint: "Paste any format — we'll normalize it", icon: <LinkIcon size={15} /> },
    { name: 'portfolio', label: 'Portfolio / Website', placeholder: 'yoursite.com',         type: 'text',  required: false, hint: 'With or without https://', icon: <Globe size={15} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(({ name, label, placeholder, type, required, hint, icon }) => (
        <div key={name}>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            {label}
            {required && <span className="ml-1" style={{ color: 'var(--color-accent)' }}>*</span>}
          </label>
          <Input {...register(name)} type={type} placeholder={placeholder} icon={icon} hint={hint} error={errors[name]?.message} />
        </div>
      ))}
    </div>
  );
}
