import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

/* Card — base surface container */
const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('surface', className)}
    {...props}
  />
));
Card.displayName = 'Card';

/* CardHeader — top section with padding */
const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1 p-5 pb-4', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/* CardTitle */
const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold leading-none tracking-tight', className)}
    style={{ color: 'var(--color-text-primary)' }}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/* CardDescription */
const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs leading-relaxed', className)}
    style={{ color: 'var(--color-text-secondary)' }}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/* CardContent */
const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

/* CardFooter */
const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-5 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
