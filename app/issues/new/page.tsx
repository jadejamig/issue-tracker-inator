'use client'

import { Button, Callout, TextArea, TextField } from '@radix-ui/themes';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';
import { zodResolver } from '@hookform/resolvers/zod';
import { createIssueSchema } from '@/app/validationSchemas';
import { z } from 'zod';
import ErrorMessage from '@/app/components/ErrorMessage';
import Spinner from '@/app/components/Spinner';

// interface IssueForm {
//     title: string;
//     description: string;
// }

type IssueForm = z.infer<typeof createIssueSchema>;

const NewIssuePage = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<IssueForm>({
        resolver: zodResolver(createIssueSchema) 
    });

    const [error, setError] = useState('');
    const [isSubmitting, setSubmitting] = useState(false);

    const onSubmit = handleSubmit(async (data) => {
        try {
            setSubmitting(true);
            await axios.post('/api/issues', data)
            router.push('/issues');
        } catch (error) {
            setSubmitting(false);
            setError('An unexpected error occured.');
        }
    });

    return (
        <div className='max-w-xl'>
            {
                error &&
                <Callout.Root color="red" className='mb-5'>
                <Callout.Icon>
                    <AiFillInfoCircle/>
                </Callout.Icon>
                <Callout.Text>
                    {error}
                </Callout.Text>
              </Callout.Root>
            }

            <form className='space-y-3' onSubmit={onSubmit}>
                <TextField.Root placeholder='Title' {...register('title')}></TextField.Root>
                <ErrorMessage>{errors.title?.message}</ErrorMessage>
                <TextArea placeholder='Description' {...register('description')}/>
                <ErrorMessage>{errors.description?.message}</ErrorMessage>
                <Button disabled={isSubmitting}>
                    Submit New Issue
                    { isSubmitting && <Spinner/>}
                </Button>

            </form>
        </div>
    )
}

export default NewIssuePage