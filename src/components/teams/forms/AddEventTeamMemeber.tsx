import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  startNumber: z.string().min(1, 'Numer startowy jest wymagany'),
});

type FormData = z.infer<typeof schema>;

export function AddEventTeamMember() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="firstName">Imię</label>
        <input {...register('firstName')} id="firstName" />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <label htmlFor="lastName">Nazwisko</label>
        <input {...register('lastName')} id="lastName" />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div>
        <label htmlFor="startNumber">Numer startowy</label>
        <input {...register('startNumber')} id="startNumber" />
        {errors.startNumber && <span>{errors.startNumber.message}</span>}
      </div>

      <button type="submit">Dodaj</button>
    </form>
  );
}